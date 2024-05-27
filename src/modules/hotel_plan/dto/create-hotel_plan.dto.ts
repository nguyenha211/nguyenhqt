import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateHotelPlanDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  @Max(2)
  hotelType: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  locationId: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  hotelId: number;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  hotelName: string;

  @ApiProperty({ example: '', required: false })
  @IsOptional()
  hotelAddress: string;

  @ApiProperty({ example: 1, required: false })
  unitPrice: number;

  @ApiProperty({ example: 1 })
  totalRoom: number;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z' })
  dayCheckin: string;

  @ApiProperty({ example: '2023-01-19T00:00:00.000Z' })
  dayCheckout: string;
}
