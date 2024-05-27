import { PartialType } from '@nestjs/swagger';
import { CreateHotelPlanDto } from './create-hotel_plan.dto';

export class UpdateHotelPlanDto extends PartialType(CreateHotelPlanDto) {}
