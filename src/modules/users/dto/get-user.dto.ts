import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  searchText: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  departmentCode: string[];

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  permissionCode: string[];
}
