import { Module } from '@nestjs/common';
import { TaxiPlanService } from './taxi_plan.service';
import { TaxiPlanController } from './taxi_plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxiPlan } from './entities/taxi_plan.entity';
import { LocationModule } from '../location/location.module';
import { TravelRequest } from '../travel-requests/entities/travel-request.entity';
import { TaxiModule } from '../taxi/taxi.module';
import { Location } from '../location/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location, TravelRequest, TaxiPlan]),
    LocationModule,
    TaxiModule,
  ],
  controllers: [TaxiPlanController],
  providers: [TaxiPlanService],
})
export class TaxiPlanModule {}
