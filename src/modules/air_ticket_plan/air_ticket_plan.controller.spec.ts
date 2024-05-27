import { Test, TestingModule } from '@nestjs/testing';
import { AirTicketPlanController } from './air_ticket_plan.controller';
import { AirTicketPlanService } from './air_ticket_plan.service';

describe('AirTicketPlanController', () => {
  let controller: AirTicketPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirTicketPlanController],
      providers: [AirTicketPlanService],
    }).compile();

    controller = module.get<AirTicketPlanController>(AirTicketPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
