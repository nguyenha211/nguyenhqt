import { Test, TestingModule } from '@nestjs/testing';
import { TravelParticipantsController } from './travel-participants.controller';
import { TravelParticipantsService } from './travel-participants.service';

describe('TravelParticipantsController', () => {
  let controller: TravelParticipantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelParticipantsController],
      providers: [TravelParticipantsService],
    }).compile();

    controller = module.get<TravelParticipantsController>(
      TravelParticipantsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
