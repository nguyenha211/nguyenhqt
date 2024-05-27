import { ApiProperty } from '@nestjs/swagger';

export class CreateAirTicketPlanDto {
  @ApiProperty({ example: 1 })
  stageStartId: number;

  @ApiProperty({ example: 1 })
  destinationId: number;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2023-01-19T00:00:00.000Z' })
  endDate: string;

  @ApiProperty({ example: 1 })
  airTicketPrice: number;

  @ApiProperty({ example: '', required: false })
  ticketCondition: string;
}
