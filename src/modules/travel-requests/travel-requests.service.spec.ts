import { Test, TestingModule } from '@nestjs/testing';
import { TravelRequestsService } from './travel-requests.service';

describe('TravelRequestsService', () => {
  let service: TravelRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelRequestsService],
    }).compile();

    service = module.get<TravelRequestsService>(TravelRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
