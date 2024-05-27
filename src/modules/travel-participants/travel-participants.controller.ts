import { Controller } from '@nestjs/common';
import { TravelParticipantsService } from './travel-participants.service';

@Controller('travel-participants')
export class TravelParticipantsController {
  constructor(
    private readonly travelParticipantsService: TravelParticipantsService,
  ) {}

  s;
}
