import { Test, TestingModule } from '@nestjs/testing';
import { HotelPlanController } from './hotel_plan.controller';
import { HotelPlanService } from './hotel_plan.service';

describe('HotelPlanController', () => {
  let controller: HotelPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelPlanController],
      providers: [HotelPlanService],
    }).compile();

    controller = module.get<HotelPlanController>(HotelPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
