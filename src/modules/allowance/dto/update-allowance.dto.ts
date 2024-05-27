import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateAllowanceDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  cost: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  stageStartId: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  destinationId: number;
}
