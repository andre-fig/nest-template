import { ApiProperty } from '@nestjs/swagger';

export class ActivateUserResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  accessToken: string;

  @ApiProperty({ example: 'd49e81f4-405f-4f2b-a292-b5a8f69f2a53' })
  refreshToken: string;

  @ApiProperty({ example: true })
  success: boolean;
}
