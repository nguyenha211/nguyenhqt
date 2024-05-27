import { PartialType } from '@nestjs/swagger';
import { CreateTravelRequestDto } from './create-travel-request.dto';

export class UpdateTravelRequestDto extends PartialType(
  CreateTravelRequestDto,
) {}
