import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsString,
  Matches,
  IsEnum,
} from 'class-validator';
import { ChannelEnum } from 'src/shared/enums/channel.enum';

export class CreateUserDto {
  @ApiProperty({
    example: '12345678901',
    description: 'User CPF (only numbers)',
  })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF must be 11 digits' })
  cpf: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Birth date (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'Phone in E.164 format',
  })
  @IsString()
  @Matches(/^\+\d{10,15}$/, { message: 'Phone must be in E.164 format' })
  phone: string;

  @ApiProperty({
    example: ChannelEnum.SMS,
    enum: ChannelEnum,
    description: 'Confirmation method to send token',
  })
  @IsEnum(ChannelEnum)
  confirmationMethod: ChannelEnum;
}
