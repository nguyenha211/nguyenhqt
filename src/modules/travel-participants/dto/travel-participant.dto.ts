import { ApiProperty } from '@nestjs/swagger';

export class TravelParticipantDto {
  @ApiProperty({ example: [''] })
  userCode: string[];
}

export class UpdateTravelParticipantDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: [''] })
  userCode: string[];
}
