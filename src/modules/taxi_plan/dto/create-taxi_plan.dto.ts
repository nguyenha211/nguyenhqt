import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTaxiPlanDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  direct: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  stageStartId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  destinationId: number;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2023-01-19T00:00:00.000Z' })
  endDate: string;

  @ApiProperty({ example: '' })
  note: string;
}
