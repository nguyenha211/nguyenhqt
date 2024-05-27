import { Test, TestingModule } from '@nestjs/testing';
import { AirTicketPlanService } from './air_ticket_plan.service';

describe('AirTicketPlanService', () => {
  let service: AirTicketPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirTicketPlanService],
    }).compile();

    service = module.get<AirTicketPlanService>(AirTicketPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
