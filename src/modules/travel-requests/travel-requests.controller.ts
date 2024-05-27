import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { CalculatePlanDto } from './dto/calculate-plan.dto';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
import { GetDetailTravelRequestDto } from './dto/get-detail-travel-request.dto';
import { GetListTravelRequestDto } from './dto/get-travel-request.dto';
import { UpdateTravelRequestDto } from './dto/update-travel-request.dto';
import { TravelRequestsService } from './travel-requests.service';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('travel-requests')
@ApiTags('travel_requests')
export class TravelRequestsController {
  constructor(private readonly travelRequestsService: TravelRequestsService) {}

  @ApiOperation({ summary: 'Tính chi phí công tác' })
  @Post('calculate-plan')
  calculatePlan(@Body() calculatePlanDto: CalculatePlanDto) {
    return this.travelRequestsService.calculatePlan(calculatePlanDto);
  }
  @Post('create')
  create(@Body() createTravelRequestDto: CreateTravelRequestDto) {
    return this.travelRequestsService.createTravelRequest(
      createTravelRequestDto,
    );
  }
  @Get('list')
  getList(
    @Query() input: GetListTravelRequestDto,
    @Query() pagination: PaginationDto,
    @Request() req,
  ) {
    return this.travelRequestsService.getListTravelRequest(
      input,
      pagination,
      req?.user,
    );
  }
  @Get('detail')
  getDetail(@Query() input: GetDetailTravelRequestDto, @Request() req) {
    return this.travelRequestsService.getDetailTravelRequest(input, req?.user);
  }

  @Put('cancel')
  cancelRequest(@Query() input: GetDetailTravelRequestDto) {
    return this.travelRequestsService.cancelTravelRequest(input);
  }
  @Put('aprrove')
  approveRequest(
    @Query() query: GetDetailTravelRequestDto,
    @Body() input: ApproveRequestDto,
  ) {
    return this.travelRequestsService.approveTravelRequest(query, input);
  }

  @Put('update')
  updateRequest(
    @Query() query: GetDetailTravelRequestDto,
    @Body() input: UpdateTravelRequestDto,
  ) {
    return this.travelRequestsService.updateTravelRequest(query, input);
  }
}
