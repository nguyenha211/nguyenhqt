import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHotelDto } from './create-hotel.dto';
import { IsBoolean } from 'class-validator';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}

export class ChangeActiveDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
