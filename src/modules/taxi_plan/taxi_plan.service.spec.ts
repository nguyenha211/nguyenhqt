import { Test, TestingModule } from '@nestjs/testing';
import { TaxiPlanService } from './taxi_plan.service';

describe('TaxiPlanService', () => {
  let service: TaxiPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxiPlanService],
    }).compile();

    service = module.get<TaxiPlanService>(TaxiPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
