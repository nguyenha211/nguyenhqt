import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends OmitType(User, [
  'departmentCode',
  'department',
  'permission',
  'departmentId',
  'travel_participants',
  'travel_request',
  'refreshToken',
]) {
  @ApiProperty({ example: '' })
  @IsString()
  departmentCode: string;
}
