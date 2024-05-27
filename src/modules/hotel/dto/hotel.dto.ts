import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class HotelDto {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  searchText: string;

  @ApiProperty({ example: [], required: false })
  @IsArray()
  @IsOptional()
  destinationId: number[];

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  isActive: boolean;
}
