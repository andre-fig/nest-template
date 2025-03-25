import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ActivateUserResponseDto } from './dtos/activate-user-response.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthTokenDto } from './dtos/auth-token.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ActivateUserDto } from './dtos/activate-user.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, type: User })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  public async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({ status: 200, type: AuthTokenDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  public async login(@Body() loginDto: LoginUserDto): Promise<AuthTokenDto> {
    return this.authService.authenticateUser(loginDto);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate a user account with confirmation token' })
  @ApiResponse({ status: 200, type: ActivateUserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid token or CPF.' })
  public async activate(
    @Body() activateDto: ActivateUserDto,
  ): Promise<ActivateUserResponseDto> {
    return this.authService.activateUser(activateDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using a valid refresh token' })
  @ApiResponse({ status: 200, type: AuthTokenDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshAccessToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<AuthTokenDto> {
    return this.authService.refreshAccessToken(dto.refreshToken);
  }
}
