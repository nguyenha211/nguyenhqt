import { ApiProperty } from '@nestjs/swagger';

export class JourneyDto {
  @ApiProperty({ example: '2023-01-15T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2023-01-19T00:00:00.000Z' })
  endDate: string;

  @ApiProperty({ example: 0 })
  isAllowanceCost: number;

  @ApiProperty({ example: '' })
  isAllowanceSpecialNote: string;

  @ApiProperty({ example: 0 })
  isAllowanceSpecialCost: number;

  @ApiProperty({ example: true })
  isUsedHotel: boolean;

  @ApiProperty({ example: '' })
  isHotelNote: string;

  @ApiProperty({ example: 0 })
  isHotelCost: number;

  @ApiProperty({ example: '' })
  isHotelSpecialNote: string;

  @ApiProperty({ example: 0 })
  isHotelSpecialCost: number;

  @ApiProperty({ example: true })
  isUsedAirTicket: boolean;

  @ApiProperty({ example: '' })
  isAirTicketNote: string;

  @ApiProperty({ example: 0 })
  isAirTicketCost: number;

  @ApiProperty({ example: '' })
  isAirTicketSpecialNote: string;

  @ApiProperty({ example: 0 })
  isAirTicketSpecialCost: number;

  @ApiProperty({ example: true })
  isUsedTaxi: boolean;

  @ApiProperty({ example: 0 })
  isTaxiCost: number;

  @ApiProperty({ example: 0 })
  stageStartId: number;

  @ApiProperty({ example: '' })
  stageStartName: string;

  @ApiProperty({ example: 0 })
  destinationId: number;

  @ApiProperty({ example: '' })
  destinationName: string;
}

export class UpdateJourneyDto {
  @ApiProperty({ example: 1 })
  journeyId: number;

  @ApiProperty({ example: '2023-01-15T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2023-01-19T00:00:00.000Z' })
  endDate: string;

  @ApiProperty({ example: 0 })
  isAllowanceCost: number;

  @ApiProperty({ example: '' })
  isAllowanceSpecialNote: string;

  @ApiProperty({ example: 0 })
  isAllowanceSpecialCost: number;

  @ApiProperty({ example: true })
  isUsedHotel: boolean;

  @ApiProperty({ example: '' })
  isHotelNote: string;

  @ApiProperty({ example: 0 })
  isHotelCost: number;

  @ApiProperty({ example: '' })
  isHotelSpecialNote: string;

  @ApiProperty({ example: 0 })
  isHotelSpecialCost: number;

  @ApiProperty({ example: true })
  isUsedAirTicket: boolean;

  @ApiProperty({ example: '' })
  isAirTicketNote: string;

  @ApiProperty({ example: 0 })
  isAirTicketCost: number;

  @ApiProperty({ example: '' })
  isAirTicketSpecialNote: string;

  @ApiProperty({ example: 0 })
  isAirTicketSpecialCost: number;

  @ApiProperty({ example: true })
  isUsedTaxi: boolean;

  @ApiProperty({ example: 0 })
  isTaxiCost: number;

  @ApiProperty({ example: 0 })
  stageStartId: number;

  @ApiProperty({ example: '' })
  stageStartName: string;

  @ApiProperty({ example: 0 })
  destinationId: number;

  @ApiProperty({ example: '' })
  destinationName: string;
}
