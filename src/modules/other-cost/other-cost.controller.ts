import { Controller } from '@nestjs/common';
import { OtherCostService } from './other-cost.service';

@Controller('other-cost')
export class OtherCostController {
  constructor(private readonly otherCostService: OtherCostService) {}
}
