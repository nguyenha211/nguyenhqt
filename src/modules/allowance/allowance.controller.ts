import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { AllowanceDto } from './dto/allowance.dto';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { ChangeActiveDto } from '../hotel/dto/update-hotel.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('allowance')
@ApiTags('allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) {}

  @Post()
  create(@Body() createAirTicketDto: CreateAllowanceDto) {
    return this.allowanceService.create(createAirTicketDto);
  }
  @Put('edit/:id')
  update(
    @Body() updateAirTicketDto: UpdateAllowanceDto,
    @Param('id') id: number,
  ) {
    return this.allowanceService.update(updateAirTicketDto, id);
  }

  @Put('changeActive/:id')
  changeActive(
    @Body() changeActiveDto: ChangeActiveDto,
    @Param('id') id: number,
  ) {
    return this.allowanceService.changeActive(id, changeActiveDto);
  }
  @Delete('delete/:id')
  delete(@Query('id') id: number) {
    return this.allowanceService.delete(id);
  }
  @Post('/list')
  getList(@Query() paginationDto: PaginationDto, @Body() input: AllowanceDto) {
    return this.allowanceService.getList(input, paginationDto);
  }
}
