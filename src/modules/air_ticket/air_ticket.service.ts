import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { ILike, In, Repository } from 'typeorm';
import { Location } from '../location/entities/location.entity';
import { AirTicketDto } from './dto/air_ticket.dto';
import { CreateAirTicketDto } from './dto/create-air_ticket.dto';
import { UpdateAirTicketDto } from './dto/update-air_ticket.dto';
import { AirTicket } from './entities/air_ticket.entity';
import { ChangeActiveDto } from '../hotel/dto/update-hotel.dto';

@Injectable()
export class AirTicketService {
  constructor(
    @InjectRepository(AirTicket)
    private readonly airTicketRepository: Repository<AirTicket>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
  async create(createAirTicketDto: CreateAirTicketDto) {
    const { active, cost, destinationId, stageStartId } = createAirTicketDto;
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
    const journeyString = await this.checkJourneyString(
      stageStartId,
      destinationId,
    );
    if (journeyString) {
      const { destinationName, stageStartName } = journeyString;
      throw new HttpException(
        `${stageStartName} - ${destinationName} đã tồn tại`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const { typeLocation: typeLocationInStageStart } = stageStart;
    const { typeLocation: typeLocationInDestination } = detination;
    const type: number = await this.checkTypeLocation(
      typeLocationInStageStart,
      typeLocationInDestination,
    );

    return await this.airTicketRepository.save({
      active,
      cost,
      type,
      destinationId: detination?.id,
      destinationName: detination?.locationName,
      stageStartId: stageStart?.id,
      stageStartName: stageStart?.locationName,
    });
  }

  async update(updateAirTicketDto: UpdateAirTicketDto, id: number) {
    const { active, cost, destinationId, stageStartId } = updateAirTicketDto;
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

    await this.airTicketRepository.update(id, {
      active,
      cost,
      type,
      destinationId: detination?.id,
      destinationName: detination?.locationName,
      stageStartId: stageStart?.id,
      stageStartName: stageStart?.locationName,
    });
    return await this.airTicketRepository.findOneBy({ id });
  }

  async changeActive(id: number, changeActiveDto: ChangeActiveDto) {
    const { isActive } = changeActiveDto;
    return await this.airTicketRepository.update(id, {
      active: isActive,
    });
  }
  async delete(id: number) {
    await this.airTicketRepository.delete(id);
    return await this.airTicketRepository.findOneBy({ id });
  }

  async getList(input: AirTicketDto, pagination: PaginationDto) {
    const { active, searchText, type } = input;
    const { page, pageSize } = pagination;
    const query = [
      {
        stageStartName: ILike(`%${searchText || ''}%`),
        type: !_.isEmpty(type) ? In(type) : null,
        active: _.isBoolean(active) ? active : In([true, false]),
      },
      {
        destinationName: ILike(`%${searchText || ''}%`),
        type: !_.isEmpty(type) ? In(type) : null,
        active: _.isBoolean(active) ? active : In([true, false]),
      },
    ];
    const [list, total] = await this.airTicketRepository.findAndCount({
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

  async checkJourneyString(stageStartId, destinationId) {
    return await this.airTicketRepository.findOneBy({
      destinationId,
      stageStartId,
    });
  }

  async checkLocationAndReturnCost(stageStartId, destinationId) {
    return await this.airTicketRepository.findOne({
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
