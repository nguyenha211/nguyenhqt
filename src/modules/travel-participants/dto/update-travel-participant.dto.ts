import { PartialType } from '@nestjs/swagger';
import { CreateTravelParticipantDto } from './create-travel-participant.dto';

export class UpdateTravelParticipantDto extends PartialType(CreateTravelParticipantDto) {}
