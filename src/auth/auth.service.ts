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
import { ActivateUserResponseDto } from './dtos/activate-user-response.dto';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async registerUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { cpf: dto.cpf },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('User with this CPF already exists.');
    }

    const user = this.userRepository.create({
      fullName: dto.fullName,
      birthDate: dto.birthDate,
      email: dto.email,
      phone: dto.phone,
      cpf: dto.cpf,
      isValidated: false,
    });

    const saved = await this.userRepository.save(user);

    // TODO: enviar token de verificação via fila Bull
    return saved;
  }

  public async authenticateUser(dto: LoginUserDto): Promise<AuthTokenDto> {
    const user = await this.userRepository.findOne({
      where: { cpf: dto.cpf, isValidated: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or not validated');
    }

    // TODO: validar token recebido por SMS/email/WhatsApp
    const isTokenValid = dto.token === '123456'; // Simulação temporária

    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = { sub: user.id.toString() };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    };
  }

  public async activateUser(
    dto: ActivateUserDto,
  ): Promise<ActivateUserResponseDto> {
    const user = await this.userRepository.findOne({ where: { cpf: dto.cpf } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // TODO: validar token real enviado para ativação
    const isTokenValid = true;

    if (!isTokenValid) {
      throw new BadRequestException('Invalid or expired token.');
    }

    user.isValidated = true;
    await this.userRepository.save(user);

    const payload = { sub: user.id.toString() };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      success: true,
    };
  }

  public async validateUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id, isValidated: true },
    });
  }

  public async refreshAccessToken(refreshToken: string): Promise<AuthTokenDto> {
    try {
      const payload: { sub: string } = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.validateUserById(+payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.id.toString() },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id.toString() },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
