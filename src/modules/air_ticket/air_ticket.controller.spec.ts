import { Test, TestingModule } from '@nestjs/testing';
import { AirTicketController } from './air_ticket.controller';
import { AirTicketService } from './air_ticket.service';

describe('AirTicketController', () => {
  let controller: AirTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirTicketController],
      providers: [AirTicketService],
    }).compile();

    controller = module.get<AirTicketController>(AirTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
