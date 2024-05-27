import { PickType } from '@nestjs/swagger';
import { Location } from '../entities/location.entity';

export class CreateLocationDto extends PickType(Location, [
  'locationName',
  'typeLocation',
]) {}
