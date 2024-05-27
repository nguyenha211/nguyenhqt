import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirTicketModule } from '../air_ticket/air_ticket.module';
import { AllowanceModule } from '../allowance/allowance.module';
import { HotelModule } from '../hotel/hotel.module';
import { Journey } from '../journey/entities/journey.entity';
import { JourneyModule } from '../journey/journey.module';
import { OtherCost } from '../other-cost/entities/other-cost.entity';
import { OtherCostModule } from '../other-cost/other-cost.module';
import { TaxiModule } from '../taxi/taxi.module';
import { TravelParticipant } from '../travel-participants/entities/travel-participant.entity';
import { TravelParticipantsModule } from '../travel-participants/travel-participants.module';
import { TravelRequest } from './entities/travel-request.entity';
import { TravelRequestsController } from './travel-requests.controller';
import { TravelRequestsService } from './travel-requests.service';
import { AirTicketPlan } from '../air_ticket_plan/entities/air_ticket_plan.entity';
import { HotelPlan } from '../hotel_plan/entities/hotel_plan.entity';
import { UsersModule } from '../users/users.module';
import { TaxiPlan } from '../taxi_plan/entities/taxi_plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TravelRequest,
      OtherCost,
      TravelParticipant,
      Journey,
      AirTicketPlan,
      HotelPlan,
      TaxiPlan,
    ]),
    OtherCostModule,
    TravelParticipantsModule,
    JourneyModule,
    TaxiModule,
    HotelModule,
    AllowanceModule,
    AirTicketModule,
    UsersModule,
  ],
  controllers: [TravelRequestsController],
  providers: [TravelRequestsService],
})
export class TravelRequestsModule {}
