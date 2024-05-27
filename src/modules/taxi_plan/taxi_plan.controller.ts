import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTravelRequestDto } from 'src/common/base/get-travel-request.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateTaxiPlanDto } from './dto/create-taxi_plan.dto';
import { UpdateTaxiPlanDto } from './dto/update-taxi_plan.dto';
import { TaxiPlanService } from './taxi_plan.service';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('taxi')
@Controller('taxi-plan')
export class TaxiPlanController {
  constructor(private readonly taxiPlanService: TaxiPlanService) {}
  @ApiOperation({ summary: 'Tạo kế hoạch' })
  @Post('create')
  create(
    @Query() query: GetTravelRequestDto,
    @Body() input: CreateTaxiPlanDto,
  ) {
    return this.taxiPlanService.create(query, input);
  }

  @Put('update-plan')
  updatePlan(
    @Body() input: UpdateTaxiPlanDto,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.taxiPlanService.updatePlan(input, id);
  }
}
