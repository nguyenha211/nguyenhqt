import { Module } from '@nestjs/common';
import { TravelParticipantsService } from './travel-participants.service';
import { TravelParticipantsController } from './travel-participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelParticipant } from './entities/travel-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TravelParticipant])],
  controllers: [TravelParticipantsController],
  providers: [TravelParticipantsService],
  exports: [TravelParticipantsService],
})
export class TravelParticipantsModule {}
