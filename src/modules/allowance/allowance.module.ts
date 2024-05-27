import { Module } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allowance } from './entities/allowance.entity';
import { Location } from '../location/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Allowance, Location])],
  controllers: [AllowanceController],
  providers: [AllowanceService],
  exports: [AllowanceService],
})
export class AllowanceModule {}
