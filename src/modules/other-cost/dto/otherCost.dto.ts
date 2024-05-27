import { ApiProperty } from '@nestjs/swagger';

export class OtherCostDto {
  @ApiProperty({ example: 0 })
  value: number;

  @ApiProperty({ example: '' })
  currency: string;

  @ApiProperty({ example: '' })
  content: string;
}

export class UpdateOtherCostDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 0 })
  value: number;

  @ApiProperty({ example: '' })
  currency: string;

  @ApiProperty({ example: '' })
  content: string;
}
