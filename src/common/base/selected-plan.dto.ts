import { ApiProperty } from '@nestjs/swagger';

export class SelectedPlanDto {
  @ApiProperty({ example: 1 })
  ticketPlanId: number;
  @ApiProperty({ example: true })
  isSelected: boolean;
}
