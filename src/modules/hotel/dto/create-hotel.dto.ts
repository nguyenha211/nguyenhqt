import { PickType } from '@nestjs/swagger';
import { Hotel } from '../entities/hotel.entity';

export class CreateHotelDto extends PickType(Hotel, [
  'active',
  'costDoubleRoom',
  'costSingleRoom',
  'destinationId',
  'hotelEmail',
  'hotelName',
  'phoneNumber',
]) {}
