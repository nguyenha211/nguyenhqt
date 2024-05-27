import { Test, TestingModule } from '@nestjs/testing';
import { TaxiPlanController } from './taxi_plan.controller';
import { TaxiPlanService } from './taxi_plan.service';

describe('TaxiPlanController', () => {
  let controller: TaxiPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxiPlanController],
      providers: [TaxiPlanService],
    }).compile();

    controller = module.get<TaxiPlanController>(TaxiPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
