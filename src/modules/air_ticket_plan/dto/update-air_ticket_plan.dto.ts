import { PartialType } from '@nestjs/swagger';
import { CreateAirTicketPlanDto } from './create-air_ticket_plan.dto';

export class UpdateAirTicketPlanDto extends PartialType(
  CreateAirTicketPlanDto,
) {}
