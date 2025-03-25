import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class ActivateUserDto {
  @ApiProperty({
    example: '12345678901',
    description: 'User CPF (only numbers)',
  })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF must be 11 digits' })
  cpf: string;

  @ApiProperty({
    example: 'ABC123',
    description: 'Token received via SMS, email or WhatsApp',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
