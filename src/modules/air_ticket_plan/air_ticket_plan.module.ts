import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirTicket } from '../air_ticket/entities/air_ticket.entity';
import { Location } from '../location/entities/location.entity';
import { LocationModule } from '../location/location.module';
import { TravelRequest } from '../travel-requests/entities/travel-request.entity';
import { AirTicketPlanController } from './air_ticket_plan.controller';
import { AirTicketPlanService } from './air_ticket_plan.service';
import { AirTicketPlan } from './entities/air_ticket_plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AirTicketPlan,
      TravelRequest,
      Location,
      AirTicket,
    ]),
    LocationModule,
  ],
  controllers: [AirTicketPlanController],
  providers: [AirTicketPlanService],
})
export class AirTicketPlanModule {}
