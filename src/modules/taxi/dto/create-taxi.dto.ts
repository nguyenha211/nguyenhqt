import { PickType } from '@nestjs/swagger';
import { Taxi } from '../entities/taxi.entity';

export class CreateTaxiDto extends PickType(Taxi, [
  'stageStartId',
  'destinationId',
  'cost4Seats',
  'cost7Seats',
  'cost16Seats',
  'active',
]) {}
