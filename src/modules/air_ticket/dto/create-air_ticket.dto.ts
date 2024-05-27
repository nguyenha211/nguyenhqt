import { PickType } from '@nestjs/swagger';
import { AirTicket } from '../entities/air_ticket.entity';

export class CreateAirTicketDto extends PickType(AirTicket, [
  'active',
  'cost',
  'destinationId',
  'stageStartId',
]) {}
