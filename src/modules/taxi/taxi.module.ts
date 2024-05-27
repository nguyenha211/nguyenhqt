import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../location/entities/location.entity';
import { Taxi } from './entities/taxi.entity';
import { TaxiController } from './taxi.controller';
import { TaxiService } from './taxi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Taxi, Location])],
  controllers: [TaxiController],
  providers: [TaxiService],
  exports: [TaxiService],
})
export class TaxiModule {}
