import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Valid refresh token', example: 'eyJhbGciOi...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
