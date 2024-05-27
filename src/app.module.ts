import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configConfig } from './config/config.config';
import { AirTicketModule } from './modules/air_ticket/air_ticket.module';
import { AirTicket } from './modules/air_ticket/entities/air_ticket.entity';
import { AirTicketPlanModule } from './modules/air_ticket_plan/air_ticket_plan.module';
import { AirTicketPlan } from './modules/air_ticket_plan/entities/air_ticket_plan.entity';
import { AllowanceModule } from './modules/allowance/allowance.module';
import { Allowance } from './modules/allowance/entities/allowance.entity';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { Department } from './modules/department/entities/department.entity';
import { Hotel } from './modules/hotel/entities/hotel.entity';
import { HotelModule } from './modules/hotel/hotel.module';
import { HotelPlan } from './modules/hotel_plan/entities/hotel_plan.entity';
import { HotelPlanModule } from './modules/hotel_plan/hotel_plan.module';
import { Journey } from './modules/journey/entities/journey.entity';
import { JourneyModule } from './modules/journey/journey.module';
import { LocationModule } from './modules/location/location.module';
import { OtherCost } from './modules/other-cost/entities/other-cost.entity';
import { OtherCostModule } from './modules/other-cost/other-cost.module';
import { Permission } from './modules/permission/entities/permission.entity';
import { PermissionModule } from './modules/permission/permission.module';
import { Taxi } from './modules/taxi/entities/taxi.entity';
import { TaxiModule } from './modules/taxi/taxi.module';
import { TaxiPlan } from './modules/taxi_plan/entities/taxi_plan.entity';
import { TaxiPlanModule } from './modules/taxi_plan/taxi_plan.module';
import { TravelParticipant } from './modules/travel-participants/entities/travel-participant.entity';
import { TravelParticipantsModule } from './modules/travel-participants/travel-participants.module';
import { TravelRequest } from './modules/travel-requests/entities/travel-request.entity';
import { TravelRequestsModule } from './modules/travel-requests/travel-requests.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { Location } from './modules/location/entities/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot(configConfig),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'N9696893Asd',
      database: 'learn-nestjs',
      entities: [
        Department,
        User,
        Location,
        Permission,
        AirTicket,
        Allowance,
        Hotel,
        Journey,
        Taxi,
        OtherCost,
        TravelRequest,
        TravelParticipant,
        AirTicketPlan,
        HotelPlan,
        TaxiPlan,
      ],
      synchronize: true,
    }),
    UsersModule,
    DepartmentModule,
    LocationModule,
    PermissionModule,
    JourneyModule,
    TaxiModule,
    AirTicketModule,
    HotelModule,
    AllowanceModule,
    TravelParticipantsModule,
    OtherCostModule,
    TravelRequestsModule,
    AirTicketPlanModule,
    HotelPlanModule,
    TaxiPlanModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
