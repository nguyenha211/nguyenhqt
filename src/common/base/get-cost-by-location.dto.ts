import { PartialType } from '@nestjs/swagger';
import { GetTravelRequestDto } from './get-travel-request.dto';

export class getCostDto {
  stageStartId: number;
  destinationId: number;
}

export class getHotelCostDto extends PartialType(GetTravelRequestDto) {
  locationId: number;
  hotelName: string;
}
