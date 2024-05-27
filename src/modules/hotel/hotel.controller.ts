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
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { HotelDto } from './dto/hotel.dto';
import { ChangeActiveDto, UpdateHotelDto } from './dto/update-hotel.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('hotel')
@ApiTags('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('create')
  create(@Body() input: CreateHotelDto) {
    return this.hotelService.create(input);
  }

  @Post('list')
  get(@Body() input: HotelDto, @Query() pagination: PaginationDto) {
    return this.hotelService.getList(input, pagination);
  }

  @Put('update/:id')
  update(@Body() input: UpdateHotelDto, @Query('id') id: number) {
    return this.hotelService.update(input, id);
  }

  @Put('changeActive/:id')
  changeActive(
    @Body() changeActiveDto: ChangeActiveDto,
    @Query('id') id: number,
  ) {
    return this.hotelService.changeActive(id, changeActiveDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.hotelService.delete(id);
  }
}
