import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { ILike, In, Repository } from 'typeorm';
import { ChangeActiveDto } from '../hotel/dto/update-hotel.dto';
import { Location } from '../location/entities/location.entity';
import { CreateTaxiDto } from './dto/create-taxi.dto';
import { TaxiDto } from './dto/taxi.dto';
import { UpdateTaxiDto } from './dto/update-taxi.dto';
import { Taxi } from './entities/taxi.entity';

@Injectable()
export class TaxiService {
  constructor(
    @InjectRepository(Taxi) private readonly taxiRepository: Repository<Taxi>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
  async create(input: CreateTaxiDto) {
    const {
      active,
      cost16Seats,
      cost4Seats,
      cost7Seats,
      destinationId,
      stageStartId,
    } = input;
    const stageStart = await this.checkLocation(stageStartId);
    const detination = await this.checkLocation(destinationId);
    if (!stageStart) {
      throw new HttpException(
        'Không tìm thấy vị trí của điểm đi',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!detination) {
      throw new HttpException(
        'Không tìm thấy vị trí của điểm đến',
        HttpStatus.NOT_FOUND,
      );
    }
    const { typeLocation: typeLocationInStageStart } = stageStart;
    const { typeLocation: typeLocationInDestination } = detination;
    const type: number = await this.checkTypeLocation(
      typeLocationInStageStart,
      typeLocationInDestination,
    );
    return await this.taxiRepository.save({
      active,
      cost16Seats,
      cost4Seats,
      cost7Seats,
      type,
      destinationId: detination?.id,
      destinationName: detination?.locationName,
      stageStartId: stageStart?.id,
      stageStartName: stageStart?.locationName,
    });
  }

  async update(UpdateTaxiDto: UpdateTaxiDto, id: number) {
    const {
      active,
      cost16Seats,
      cost4Seats,
      cost7Seats,
      destinationId,
      stageStartId,
    } = UpdateTaxiDto;
    const stageStart = await this.checkLocation(stageStartId);
    const detination = await this.checkLocation(destinationId);
    if (!stageStart) {
      throw new HttpException(
        'Không tìm thấy vị trí của điểm đi',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!destinationId) {
      throw new HttpException(
        'Không tìm thấy vị trí của điểm đến',
        HttpStatus.NOT_FOUND,
      );
    }
    const { typeLocation: typeLocationInStageStart } = stageStart;
    const { typeLocation: typeLocationInDestination } = detination;
    const type: number = await this.checkTypeLocation(
      typeLocationInStageStart,
      typeLocationInDestination,
    );

    await this.taxiRepository.update(id, {
      active,
      cost16Seats,
      cost4Seats,
      cost7Seats,
      type,
      destinationId: detination?.id,
      destinationName: detination?.locationName,
      stageStartId: stageStart?.id,
      stageStartName: stageStart?.locationName,
    });
    return await this.taxiRepository.findOneBy({ id });
  }

  async changeActive(id: number, changeActiveDto: ChangeActiveDto) {
    const { isActive } = changeActiveDto;
    await this.taxiRepository.update(id, {
      active: isActive,
    });
    return await this.taxiRepository.findOneBy({ id });
  }

  async delete(id: number) {
    const data = await this.taxiRepository.findOneBy({ id });
    await this.taxiRepository.delete(id);
    return data;
  }

  async getList(input: TaxiDto, pagination: PaginationDto) {
    const { isActive, destinationId, stageStartId, typeLocation, searchText } =
      input;
    const { page, pageSize } = pagination;
    const query = [
      {
        stageStartName: ILike(`%${searchText || ''}%`),
        type: !_.isEmpty(typeLocation) ? In(typeLocation) : null,
        active: _.isBoolean(isActive) ? isActive : In([true, false]),
        stageStartId: !_.isEmpty(stageStartId) ? In(stageStartId) : null,
        destinationId: !_.isEmpty(destinationId) ? In(destinationId) : null,
      },
      {
        destinationName: ILike(`%${searchText || ''}%`),
        type: !_.isEmpty(typeLocation) ? In(typeLocation) : null,
        active: _.isBoolean(isActive) ? isActive : In([true, false]),
        stageStartId: !_.isEmpty(stageStartId) ? In(stageStartId) : null,
        destinationId: !_.isEmpty(destinationId) ? In(destinationId) : null,
      },
    ];
    const [list, total] = await this.taxiRepository.findAndCount({
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

  async checkLocationAndReturnCost(stageStartId, destinationId) {
    return await this.taxiRepository.findOne({
      where: {
        stageStartId,
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
