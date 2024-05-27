import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetListTravelRequestDto {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  searchText: string;
}
