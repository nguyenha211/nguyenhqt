import { Test, TestingModule } from '@nestjs/testing';
import { TravelRequestsController } from './travel-requests.controller';
import { TravelRequestsService } from './travel-requests.service';

describe('TravelRequestsController', () => {
  let controller: TravelRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelRequestsController],
      providers: [TravelRequestsService],
    }).compile();

    controller = module.get<TravelRequestsController>(TravelRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
