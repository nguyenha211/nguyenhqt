import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'thinhlh7' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'N9696893Asd@!' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: '' })
  @IsString()
  refreshToken: string;
}
