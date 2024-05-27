import { Test, TestingModule } from '@nestjs/testing';
import { TravelParticipantsService } from './travel-participants.service';

describe('TravelParticipantsService', () => {
  let service: TravelParticipantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelParticipantsService],
    }).compile();

    service = module.get<TravelParticipantsService>(TravelParticipantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
