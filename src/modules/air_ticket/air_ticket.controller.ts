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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChangeActiveDto } from '../hotel/dto/update-hotel.dto';
import { AirTicketService } from './air_ticket.service';
import { AirTicketDto } from './dto/air_ticket.dto';
import { CreateAirTicketDto } from './dto/create-air_ticket.dto';
import { UpdateAirTicketDto } from './dto/update-air_ticket.dto';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('air-ticket')
@ApiTags('airTicket')
export class AirTicketController {
  constructor(private readonly airTicketService: AirTicketService) {}

  @Post('/list')
  getList(@Query() paginationDto: PaginationDto, @Body() input: AirTicketDto) {
    return this.airTicketService.getList(input, paginationDto);
  }

  @Post()
  create(@Body() createAirTicketDto: CreateAirTicketDto) {
    return this.airTicketService.create(createAirTicketDto);
  }

  @Put('edit/:id')
  update(
    @Body() updateAirTicketDto: UpdateAirTicketDto,
    @Param('id') id: number,
  ) {
    return this.airTicketService.update(updateAirTicketDto, id);
  }

  @Put('changeActive/:id')
  changeActive(
    @Body() changeActiveDto: ChangeActiveDto,
    @Param('id') id: number,
  ) {
    return this.airTicketService.changeActive(id, changeActiveDto);
  }

  @Delete('delete/:id')
  delete(@Query('id') id: number) {
    return this.airTicketService.delete(id);
  }
}
