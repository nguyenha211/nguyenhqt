import { Test, TestingModule } from '@nestjs/testing';
import { HotelPlanService } from './hotel_plan.service';

describe('HotelPlanService', () => {
  let service: HotelPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelPlanService],
    }).compile();

    service = module.get<HotelPlanService>(HotelPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
