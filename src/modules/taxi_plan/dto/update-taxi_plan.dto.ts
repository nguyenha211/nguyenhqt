import { PartialType } from '@nestjs/swagger';
import { CreateTaxiPlanDto } from './create-taxi_plan.dto';

export class UpdateTaxiPlanDto extends PartialType(CreateTaxiPlanDto) {}
