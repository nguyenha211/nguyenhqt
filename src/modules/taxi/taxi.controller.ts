import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ChangeActiveDto } from '../hotel/dto/update-hotel.dto';
import { CreateTaxiDto } from './dto/create-taxi.dto';
import { TaxiDto } from './dto/taxi.dto';
import { UpdateTaxiDto } from './dto/update-taxi.dto';
import { TaxiService } from './taxi.service';
@ApiBearerAuth()
@Controller('taxi')
@ApiTags('taxi')
export class TaxiController {
  constructor(private readonly taxiService: TaxiService) {}
  @UseGuards(AuthGuard)
  @Post('list')
  getList(@Query() pagination: PaginationDto, @Body() input: TaxiDto) {
    return this.taxiService.getList(input, pagination);
  }
  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() input: CreateTaxiDto) {
    return this.taxiService.create(input);
  }
  @UseGuards(AuthGuard)
  @Put('update/:id')
  update(@Body() input: UpdateTaxiDto, @Query('id') id: number) {
    return this.taxiService.update(input, id);
  }
  @UseGuards(AuthGuard)
  @Put('changeActive/:id')
  changeActive(
    @Body() changeActiveDto: ChangeActiveDto,
    @Query('id') id: number,
  ) {
    return this.taxiService.changeActive(id, changeActiveDto);
  }
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  delete(@Query('id') id: number) {
    return this.taxiService.delete(id);
  }
}
