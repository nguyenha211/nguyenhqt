import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { JourneyDto } from 'src/modules/journey/dto/journey.dto';
import { OtherCostDto } from 'src/modules/other-cost/dto/otherCost.dto';

export class CreateTravelRequestDto {
  @ApiProperty({ example: '' })
  isMain: string;

  @ApiProperty({ example: 1 })
  targetType: number;

  @ApiProperty({ example: '' })
  companyInvitation: string;

  @ApiProperty({ example: '' })
  targetDetail: string;

  @ApiProperty({ example: 1 })
  travelType: number;

  @ApiProperty({ example: 1 })
  journeyType: number;

  @ApiProperty({ example: 0 })
  otherProject: number;

  @ApiProperty({ example: 0 })
  otherDepartment: number;

  @ApiProperty({
    example: [''],
  })
  userCode: string[];

  @ApiProperty({
    type: [JourneyDto],
  })
  @IsArray()
  journey: JourneyDto[];

  @ApiProperty({
    type: [OtherCostDto],
  })
  otherCost: OtherCostDto[];
}
