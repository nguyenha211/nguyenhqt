import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TravelParticipant } from './entities/travel-participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TravelParticipantsService {
  constructor(
    @InjectRepository(TravelParticipant)
    private travelParticipantRepository: Repository<TravelParticipant>,
  ) {}
  async getParticipantByTravelRequestId(travelRequestId: number) {
    const [participant, total] =
      await this.travelParticipantRepository.findAndCount({
        relations: { users: true, travel_requests: true },
        where: {
          travelRequestId,
        },
      });
    return {
      list: participant,
      total,
    };
  }
}
