import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { IsPassword } from 'src/utils/is-password.constraint';

export class UpdateUserDto {
  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  @IsPassword({
    message:
      'Password must contain at least one uppercase letter, one special character, and be at least 8 characters long.',
  })
  password: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ example: '', required: false })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  permissionCode: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  departmentCode: string;
}
