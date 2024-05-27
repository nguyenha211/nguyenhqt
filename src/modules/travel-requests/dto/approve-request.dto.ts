import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ApproveRequestDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  status: number;

  @ApiProperty({ example: '' })
  reason: string;
}
