import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getHotelCostDto } from 'src/common/base/get-cost-by-location.dto';
import { GetTravelRequestDto } from 'src/common/base/get-travel-request.dto';
import { SelectedPlanDto } from 'src/common/base/selected-plan.dto';
import { CreateHotelPlanDto } from './dto/create-hotel_plan.dto';
import { UpdateHotelPlanDto } from './dto/update-hotel_plan.dto';
import { HotelPlanService } from './hotel_plan.service';
import { AuthGuard } from '../auth/guards/auth.guard';
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('hotel')
@Controller('hotel-plan')
export class HotelPlanController {
  constructor(private readonly hotelPlanService: HotelPlanService) {}

  @ApiOperation({ summary: 'lấy giá khách sạn' })
  @Get('price')
  getPriceHotelPlan(@Query() input: getHotelCostDto) {
    return this.hotelPlanService.getPriceHotel(input);
  }

  @ApiOperation({ summary: 'Lấy số lương phòng' })
  @Get('total-room')
  getTravevlParticipant(@Query() input: GetTravelRequestDto) {
    return this.hotelPlanService.getTravelParticipant(input);
  }

  @ApiOperation({ summary: 'tạo kế hoạch' })
  @Post('create')
  create(
    @Query() query: GetTravelRequestDto,
    @Body() input: CreateHotelPlanDto,
  ) {
    return this.hotelPlanService.create(query, input);
  }

  @ApiOperation({
    summary: 'Chọn phương án',
  })
  @Post('accept-plan')
  acceptPlan(@Body() input: SelectedPlanDto, @Request() req) {
    return this.hotelPlanService.isSelectedRequestPlan(input, req?.user);
  }
  @Put('update-plan')
  updatePlan(
    @Body() input: UpdateHotelPlanDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.hotelPlanService.updatePlan(input, id);
  }
}
