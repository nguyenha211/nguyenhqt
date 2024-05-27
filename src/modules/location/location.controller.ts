import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { GetListLocationDto } from './dto/get-list-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';
import { AuthGuard } from '../auth/guards/auth.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('location')
@ApiTags('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  @ApiOperation({ summary: 'Khởi tạo địa điểm' })
  @Post('create')
  createLocation(@Body() input: CreateLocationDto) {
    return this.locationService.create(input);
  }

  @ApiOperation({ summary: 'Chỉnh sửa địa điểm' })
  @Put('edit/:locationName')
  updateLocation(
    @Query('locationName') locationName: string,
    @Body()
    input: UpdateLocationDto,
  ) {
    return this.locationService.update(locationName, input);
  }

  @ApiOperation({ summary: 'Lấy danh sách địa điểm' })
  @Get('list')
  getList(
    @Query()
    input: GetListLocationDto,
  ) {
    return this.locationService.findAll(input);
  }

  @Delete('delete/:locatioName')
  deleteLocation(@Query('locationName') locationName: string) {
    return this.locationService.delete(locationName);
  }

  @Get('typeLocation')
  getTypeLocation() {
    return this.locationService.getTypeLocation();
  }
}
