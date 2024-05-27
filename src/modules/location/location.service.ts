import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { GetListLocationDto } from './dto/get-list-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';

import * as _ from 'lodash';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}
  async create(input: CreateLocationDto) {
    const { locationName } = input;
    const location = await this.checkExistLocationByName(locationName);
    if (location) {
      throw new HttpException(
        `Dữ liệu ${locationName} đã tồn tại`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.locationRepository.save(input);
  }

  async update(locationName: string, input: UpdateLocationDto) {
    const location = await this.checkExistLocationByName(locationName);
    if (!location) {
      throw new HttpException(
        `Không tìm thấy dữ liệu ${locationName}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { id } = location;
    await this.locationRepository.update(id, {
      locationName: input.locationName,
      typeLocation: input.typeLocation,
    });
    return await this.locationRepository.findOne({ where: { id } });
  }

  async findAll(input: GetListLocationDto) {
    const { page, pageSize, searchText, type } = input;
    const query = [
      {
        locationName: ILike(`%${searchText || ''}%`),
        typeLocation: !_.isNil(type) ? type : null,
      },
    ];
    const [data, total]: any = await this.locationRepository.findAndCount({
      select: {
        createdAt: true,
        createdBy: true,
        id: true,
        locationName: true,
        typeLocation: true,
        updatedAt: true,
        updatedBy: true,
      },
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
      list: data,
      pagination: {
        totalElement: total,
        currentPage,
        lastPage,
        nextPage,
        previousPage,
      },
    };
  }

  async delete(locationName: string) {
    const location = await this.checkExistLocationByName(locationName);
    if (!location) {
      throw new HttpException(
        `Không tìm thấy dữ liệu ${locationName}`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.locationRepository.remove(location);
    return location;
  }

  async getTypeLocation() {
    const data = await this.locationRepository.find();
    const options = _.map(data, (location: Location) => {
      return {
        value: location.typeLocation,
        label: location?.typeLocation === 1 ? 'Trong nước' : 'Nước ngoài',
      };
    });
    const uniqueResponse = Array.from(
      new Map(options.map((item) => [item.value, item])).values(),
    );
    return uniqueResponse;
  }

  async checkExistLocationByName(locationName: string) {
    const location = await this.locationRepository.findOne({
      where: { locationName },
    });
    return location;
  }

  async checkExistLocationById(locationId: number) {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
    });
    return location;
  }
}
