import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { JourneyDto } from 'src/modules/journey/dto/journey.dto';
import { OtherCostDto } from 'src/modules/other-cost/dto/otherCost.dto';

export class CalculatePlanDto {
  @ApiProperty({ example: '' })
  isMain: string;

  @ApiProperty({ example: 1 })
  targetType: number;

  @ApiProperty({ example: '' })
  targetDetail: string;

  @ApiProperty({ example: 1 })
  travelType: number;

  @ApiProperty({ example: 1 })
  journeyType: number;

  @ApiProperty({ example: 1 })
  otherProject: number;

  @ApiProperty({ example: 1 })
  otherDepartment: number;

  @ApiProperty({
    example: [''],
  })
  userCode: string[];

  @ApiProperty({
    type: [
      OmitType(JourneyDto, [
        'isHotelCost',
        'isAirTicketCost',
        'isAllowanceCost',
        'isTaxiCost',
      ]),
    ],
  })
  @IsArray()
  journey: JourneyDto[];

  @ApiProperty({
    type: [OtherCostDto],
  })
  otherCost: OtherCostDto[];
}

// {
//   isMain: '';
//   targetDetail: 'string';
//   travelType: 1;
//   journeyType: 1;
//   otherProject: 0;
//   otherDepartment: 0;
//   travel_participants: [
//     {
//       userCode: '',
//     },
//   ];

//   journey: [
//     {
//       startDate: '',
//       endDate: '',
//       isAllowanceCost: 0,
//       isAllowanceSpecialNote: '',
//       isAllowanceSpecialCost: 0,
//       isUsedHotel: true,
//       isHotelNote: '',
//       isHotelCost: 0,
//       isHotelSpecialNote: '',
//       isHotelSpecialCost: 0,
//       isUsedAirTicket: true,
//       isAirTicketNote: '',
//       isAirTicketCost: 0,
//       isAirTicketSpecialNote: '',
//       isAirTicketSpecialCost: 0,
//       isUsedTaxi: true,
//       isTaxiCost: 0,
//       stageStartId: 0,
//       stageStartName: '',
//       destinationId: 0,
//       destinationName: '',
//     },
//   ];
//   otherCost: [
//     {
//       content: '',
//       value: 0,
//     },
//   ];
// }
