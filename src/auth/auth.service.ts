import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dtos/create-user.dto';
import { ActivateUserDto } from './dtos/activate-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { DatabaseEnum } from 'src/shared/enums/database.enum';
import { QueueEnum } from 'src/shared/enums/queue.enum';
import { DispatchMessageDto } from 'src/dispatcher/dtos/dispatch-message.dto';
import { ChannelEnum } from 'src/shared/enums/channel.enum';
import { BullmqService } from 'src/bullmq/bullmq.service';
import { RedisService } from 'src/databases/redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private static readonly TOKEN_TTL_SECONDS = 5 * 60;
  private static readonly ACCESS_TOKEN_EXPIRES_IN = 15 * 60;
  private static readonly REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60;

  constructor(
    @InjectRepository(UserEntity, DatabaseEnum.POSTGRES)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly bullService: BullmqService,
    private readonly configService: ConfigService,
  ) {}

  public async registerUser(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepository.exists({
      where: { cpf: dto.cpf },
    });

    if (existing) {
      throw new ConflictException('User with this CPF already exists.');
    }

    const user = this.userRepository.create({
      birthDate: dto.birthDate,
      email: dto.email,
      phone: dto.phone,
      cpf: dto.cpf,
      isValidated: false,
    });

    const saved = await this.userRepository.save(user);

    const token = await this.generateUniqueToken();

    await this.redisService.set(
      this.getTokenKey(token),
      { userId: saved.id },
      AuthService.TOKEN_TTL_SECONDS,
    );

    await this.bullService.addJob<DispatchMessageDto>(
      QueueEnum.DISPATCHER,
      this.registerUser.name,
      {
        channel: dto.confirmationMethod,
        recipient:
          dto.confirmationMethod === ChannelEnum.EMAIL ? dto.email : dto.phone,
        payload: { body: token },
      },
    );

    return saved;
  }

  public async authenticateUser(dto: LoginUserDto): Promise<AuthTokenDto> {
    const user = await this.userRepository.findOne({
      where: { cpf: dto.cpf, isValidated: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or not validated');
    }

    const tokenKey = this.getTokenKey(dto.token);

    const tokenData = await this.redisService.get<{ userId: string }>(tokenKey);

    const isTokenValid = tokenData?.userId === user.id;

    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.redisService.del(tokenKey);

    return this.generateAuthTokens(user.id.toString());
  }

  public async activateUser(dto: ActivateUserDto): Promise<AuthTokenDto> {
    const user = await this.userRepository.findOne({
      where: { cpf: dto.cpf, isValidated: false },
    });

    if (!user) {
      throw new BadRequestException('User not found or already validated');
    }

    const tokenKey = this.getTokenKey(dto.token);
    const tokenData = await this.redisService.get<{ userId: string }>(tokenKey);

    const isTokenValid = tokenData?.userId === user.id;

    if (!isTokenValid) {
      throw new BadRequestException('Invalid or expired token.');
    }

    await this.redisService.del(tokenKey);

    user.isValidated = true;
    await this.userRepository.save(user);

    return this.generateAuthTokens(user.id.toString());
  }

  public async validateUserById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id, isValidated: true },
    });
  }

  public async refreshAccessToken(refreshToken: string): Promise<AuthTokenDto> {
    try {
      const payload: { sub: string } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateAuthTokens(user.id.toString());
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateAuthTokens(userId: string): AuthTokenDto {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: AuthService.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: AuthService.REFRESH_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: AuthService.ACCESS_TOKEN_EXPIRES_IN,
    };
  }

  private async generateUniqueToken(): Promise<string> {
    let token: string;
    let exists: boolean;

    do {
      token = this.generateRandomToken();
      exists = await this.redisService.exists(this.getTokenKey(token));
    } while (exists);

    return token;
  }

  private generateRandomToken(): string {
    const randomSixDigitToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    return randomSixDigitToken;
  }

  private getTokenKey(token: string): string {
    return `user:token:${token}`;
  }
}
