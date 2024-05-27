import { Module } from '@nestjs/common';
import { OtherCostService } from './other-cost.service';
import { OtherCostController } from './other-cost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherCost } from './entities/other-cost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtherCost])],
  controllers: [OtherCostController],
  providers: [OtherCostService],
  exports: [OtherCostService],
})
export class OtherCostModule {}
