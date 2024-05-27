import { Module } from '@nestjs/common';
import { AirTicketService } from './air_ticket.service';
import { AirTicketController } from './air_ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirTicket } from './entities/air_ticket.entity';
import { Location } from '../location/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirTicket, Location])],
  controllers: [AirTicketController],
  providers: [AirTicketService],
  exports: [AirTicketService],
})
export class AirTicketModule {}
