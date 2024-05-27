import { PartialType } from '@nestjs/swagger';
import { CreateTaxiDto } from './create-taxi.dto';

export class UpdateTaxiDto extends PartialType(CreateTaxiDto) {}
