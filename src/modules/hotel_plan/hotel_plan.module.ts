import { Module } from '@nestjs/common';
import { HotelPlanService } from './hotel_plan.service';
import { HotelPlanController } from './hotel_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelPlan } from './entities/hotel_plan.entity';
import { TravelRequest } from '../travel-requests/entities/travel-request.entity';
import { Hotel } from '../hotel/entities/hotel.entity';
import { LocationModule } from '../location/location.module';
import { TravelParticipantsModule } from '../travel-participants/travel-participants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HotelPlan, TravelRequest, Hotel]),
    LocationModule,
    TravelParticipantsModule,
  ],
  controllers: [HotelPlanController],
  providers: [HotelPlanService],
})
export class HotelPlanModule {}
