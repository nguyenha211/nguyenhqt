import { PickType } from '@nestjs/swagger';
import { Allowance } from '../entities/allowance.entity';

export class CreateAllowanceDto extends PickType(Allowance, [
  'active',
  'cost',
  'destinationId',
  'stageStartId',
]) {}
