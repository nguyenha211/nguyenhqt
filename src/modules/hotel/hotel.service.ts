import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { ILike, In, Repository } from 'typeorm';
import { Location } from '../location/entities/location.entity';
import { ChangeActiveDto, UpdateHotelDto } from './dto/update-hotel.dto';
import * as _ from 'lodash';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { HotelDto } from './dto/hotel.dto';
import { PaginationDto } from 'src/common/base/pagination-base.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createHotelDto: CreateHotelDto) {
    const {
      active,
      costDoubleRoom,
      costSingleRoom,
      destinationId,
      hotelEmail,
      hotelName,
      phoneNumber,
    } = createHotelDto;
    const detination = await this.checkLocation(destinationId);

    if (!detination) {
      throw new HttpException(
        'Không tìm thấy vị trí của điểm đến',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.hotelRepository.save({
      active,
      costDoubleRoom,
      costSingleRoom,
      hotelEmail,
      phoneNumber,
      hotelName,
      destinationId: detination?.id,
      destinationName: detination?.locationName,
    });
  }

  async update(updateHotelDto: UpdateHotelDto, id: number) {
    const {
      active,
      costDoubleRoom,
      costSingleRoom,
      destinationId,
      hotelEmail,
      phoneNumber,
      hotelName,
    } = updateHotelDto;

    const detination = await this.checkLocation(destinationId);
    await this.hotelRepository.update(id, {
      active,
      costDoubleRoom,
      costSingleRoom,
      hotelEmail,
      phoneNumber,
      hotelName,
      destinationId: detination?.id,
      destinationName: detination?.locationName,
    });
    return await this.hotelRepository.findOneBy({ id });
  }

  async changeActive(id: number, changeActiveDto: ChangeActiveDto) {
    const { isActive } = changeActiveDto;
    return await this.hotelRepository.update(id, {
      active: isActive,
    });
  }
  async delete(id: number) {
    await this.hotelRepository.delete(id);
    return await this.hotelRepository.findOneBy({ id });
  }

  async getList(input: HotelDto, pagination: PaginationDto) {
    const { isActive, destinationId, searchText } = input;
    const { page, pageSize } = pagination;
    const query = [
      {
        hotelName: ILike(`%${searchText || ''}%`),
        active: _.isBoolean(isActive) ? isActive : In([true, false]),
        destinationId: !_.isEmpty(destinationId) ? In(destinationId) : null,
      },
      {
        phoneNumber: ILike(`%${searchText || ''}%`),
        active: _.isBoolean(isActive) ? isActive : In([true, false]),
        destinationId: !_.isEmpty(destinationId) ? In(destinationId) : null,
      },
      {
        hotelEmail: ILike(`%${searchText || ''}%`),
        active: _.isBoolean(isActive) ? isActive : In([true, false]),
        destinationId: !_.isEmpty(destinationId) ? In(destinationId) : null,
      },
      {
        destinationName: ILike(`%${searchText || ''}%`),
        active: _.isBoolean(isActive) ? isActive : In([true, false]),
        destinationId: !_.isEmpty(destinationId) ? In(destinationId) : null,
      },
    ];
    const [list, total] = await this.hotelRepository.findAndCount({
      where: query,
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const lastPage = Math.ceil(total / pageSize);
    const currentPage = +parseInt(page as any);
    const nextPage: number =
      currentPage + 1 > lastPage ? null : currentPage + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      list,
      pagination: {
        totalElement: total,
        currentPage: page,
        lastPage,
        nextPage,
        previousPage,
      },
    };
  }

  async checkLocation(locationId: number) {
    return await this.locationRepository.findOneBy({
      id: locationId,
    });
  }

  async checkLocationAndReturnCost(destinationId) {
    return await this.hotelRepository.findOne({
      where: {
        destinationId,
      },
    });
  }

  async checkTypeLocation(
    typeLocationInStageStart: number,
    typeLocationInDestination: number,
  ) {
    if (_.isEqual(typeLocationInStageStart, typeLocationInDestination)) {
      return 1;
    } else {
      return 2;
    }
  }
}
