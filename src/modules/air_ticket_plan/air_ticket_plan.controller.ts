import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getCostDto } from 'src/common/base/get-cost-by-location.dto';
import { GetTravelRequestDto } from 'src/common/base/get-travel-request.dto';
import { AirTicketPlanService } from './air_ticket_plan.service';
import { CreateAirTicketPlanDto } from './dto/create-air_ticket_plan.dto';
import { SelectedPlanDto } from '../../common/base/selected-plan.dto';
import { UpdateAirTicketPlanDto } from './dto/update-air_ticket_plan.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('air-ticket-plan')
@ApiTags('airTicket')
export class AirTicketPlanController {
  constructor(private readonly airTicketPlanService: AirTicketPlanService) {}
  @ApiOperation({
    summary: 'Tính giá trị vé máy bay dựa trên điểm đi - điểm đến',
  })
  @Get('cost-air-ticket')
  getCost(@Param() input: getCostDto) {
    return this.airTicketPlanService.getPriceAirTicket(input);
  }

  @Post('create')
  create(
    @Body() input: CreateAirTicketPlanDto,
    @Query() ticketRequest: GetTravelRequestDto,
  ) {
    return this.airTicketPlanService.createAirTicketPlan(input, ticketRequest);
  }

  @ApiOperation({
    summary: 'Chọn phương án',
  })
  @Post('accept-plan')
  acceptPlan(@Body() input: SelectedPlanDto, @Request() req) {
    return this.airTicketPlanService.isSelectedRequestPlan(input, req?.user);
  }

  @Put('update-plan')
  updatePlan(
    @Body() input: UpdateAirTicketPlanDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.airTicketPlanService.updatePlan(input, id);
  }
}
