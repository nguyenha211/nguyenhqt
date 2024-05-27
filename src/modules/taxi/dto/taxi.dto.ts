import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class TaxiDto {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  searchText: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  stageStartId: number[];

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  @IsArray()
  destinationId: number[];

  @ApiProperty({ example: [1], required: false })
  @IsOptional()
  typeLocation: number[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
