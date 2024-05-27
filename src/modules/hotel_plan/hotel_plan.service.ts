import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getHotelCostDto } from 'src/common/base/get-cost-by-location.dto';
import { GetTravelRequestDto } from 'src/common/base/get-travel-request.dto';
import { Not, Repository } from 'typeorm';
import { Hotel } from '../hotel/entities/hotel.entity';
import { LocationService } from '../location/location.service';
import { TravelRequest } from '../travel-requests/entities/travel-request.entity';
import { CreateHotelPlanDto } from './dto/create-hotel_plan.dto';
import { HotelPlan } from './entities/hotel_plan.entity';
import { TravelParticipantsService } from '../travel-participants/travel-participants.service';
import { SelectedPlanDto } from 'src/common/base/selected-plan.dto';
import { UpdateHotelPlanDto } from './dto/update-hotel_plan.dto';
import * as _ from 'lodash';
@Injectable()
export class HotelPlanService {
  constructor(
    @InjectRepository(HotelPlan)
    private readonly hotelPlanRepository: Repository<HotelPlan>,

    @InjectRepository(TravelRequest)
    private readonly travelRequestRepository: Repository<TravelRequest>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,

    private locationServices: LocationService,
    private travelPaticipantService: TravelParticipantsService,
  ) {}

  async create(query: GetTravelRequestDto, input: CreateHotelPlanDto) {
    const { id, requestCode } = query;
    const {
      dayCheckin,
      dayCheckout,
      hotelAddress,
      hotelId,
      hotelName,
      hotelType,
      locationId,
      totalRoom,
      unitPrice,
    } = input;

    const location =
      await this.locationServices.checkExistLocationById(locationId);
    if (!location) {
      throw new HttpException('Không tìm thấy địa điểm', HttpStatus.NOT_FOUND);
    }
    const travelRequest = await this.travelRequestRepository.findOneBy({
      id,
      requestCode,
    });
    if (!travelRequest) {
      throw new HttpException(
        `Không tìm thấy ${requestCode}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (location && hotelType === 1) {
      return await this.hotelPlanRepository.save({
        dayCheckin,
        dayCheckout,
        hotelId,
        hotelType,
        locationId,
        locationName: location.locationName,
        totalRoom,
        unitPrice,
        hotelName,
        hotelRequestId: travelRequest.id,
        isSelected: false,
      });
    } else {
      return await this.hotelPlanRepository.save({
        dayCheckin,
        dayCheckout,
        hotelType,
        hotelAddress,
        totalRoom,
        unitPrice,
        hotelRequestId: travelRequest.id,
        isSelected: false,
      });
    }
  }

  async getPriceHotel(input: getHotelCostDto) {
    const { locationId, id, requestCode, hotelName } = input;
    const travelRequest = await this.travelRequestRepository.findOneBy({
      id,
      requestCode,
    });
    if (!travelRequest) {
      throw new HttpException(
        `Không tìm thấy ${requestCode}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const hotelCostInDB = await this.hotelRepository.findOne({
      where: {
        destinationId: locationId,
        hotelName,
      },
    });
    if (!hotelCostInDB) {
      throw new HttpException(
        `Không tìm thấy khách sạn ${hotelName}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const participant =
      await this.travelPaticipantService.getParticipantByTravelRequestId(
        travelRequest.parentId,
      );
    const { total } = participant;
    const { costSingleRoom, costDoubleRoom } = hotelCostInDB;
    const totalUser = total + 1;
    const doubleRooms = Math.floor(totalUser / 2);
    const singleRooms = totalUser % 2;
    const hotelCost =
      doubleRooms * costDoubleRoom + singleRooms * costSingleRoom;

    const totalRoom = singleRooms + doubleRooms;
    return {
      hotelCost,
      room: { totalRoom, doubleRooms, singleRooms },
    };
  }

  async getTravelParticipant(input: GetTravelRequestDto) {
    const { id, requestCode } = input;
    const travelRequest = await this.travelRequestRepository.findOneBy({
      id,
      requestCode,
    });
    if (!travelRequest) {
      throw new HttpException(
        `Không tìm thấy ${requestCode}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const participant =
      await this.travelPaticipantService.getParticipantByTravelRequestId(
        travelRequest.parentId,
      );
    const { total } = participant;
    const totalUser = total + 1;
    const doubleRooms = Math.floor(totalUser / 2);
    const singleRooms = totalUser % 2;
    const totalRoom = singleRooms + doubleRooms;
    return {
      totalRoom,
    };
  }

  async isSelectedRequestPlan(input: SelectedPlanDto, user: any) {
    const { ticketPlanId, isSelected } = input;
    const travelRequest = await this.travelRequestRepository.findOne({
      select: { isMain: true },
      where: { id: ticketPlanId },
    });
    const existPlan = await this.hotelPlanRepository.findOneBy({
      id: ticketPlanId,
    });
    const { isMain } = travelRequest;
    const { username } = user;
    const canSelected = _.includes(
      isMain.toLowerCase(),
      username.toLowerCase(),
    );
    if (!canSelected) {
      throw new HttpException(
        'Không có quyền chọn kế hoạch lộ trình',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!existPlan) {
      throw new HttpException(
        'Không tìm thấy kế hoạch lộ trình',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.hotelPlanRepository.update(existPlan.id, {
      isSelected,
    });
    const otherPlans = await this.hotelPlanRepository.find({
      where: { id: Not(ticketPlanId) },
    });
    await Promise.all(
      otherPlans.map((plan) =>
        this.hotelPlanRepository.update(plan.id, { isSelected: false }),
      ),
    );
    return await this.hotelPlanRepository.findOneBy({
      id: ticketPlanId,
    });
  }

  async updatePlan(input: UpdateHotelPlanDto, id: number) {
    const {
      dayCheckin,
      dayCheckout,
      hotelAddress,
      hotelId,
      hotelName,
      hotelType,
      locationId,
      totalRoom,
      unitPrice,
    } = input;
    const location =
      await this.locationServices.checkExistLocationById(locationId);

    if (!location) {
      throw new HttpException('Không tìm thấy địa điểm', HttpStatus.NOT_FOUND);
    }
    const checkExistPlan = await this.hotelPlanRepository.findOne({
      where: { id },
    });

    if (location && hotelType === 1) {
      await this.hotelPlanRepository.update(checkExistPlan?.id, {
        dayCheckin,
        dayCheckout,
        hotelId,
        hotelType,
        locationId,
        totalRoom,
        hotelAddress: null,
        unitPrice,
        hotelName,
        isSelected: checkExistPlan?.isSelected,
      });
    } else {
      await this.hotelPlanRepository.update(checkExistPlan?.id, {
        dayCheckin,
        dayCheckout,
        hotelId: null,
        hotelName: null,
        locationId: null,
        locationName: null,
        hotelType,
        hotelAddress,
        totalRoom,
        unitPrice,
        isSelected: checkExistPlan?.isSelected,
      });
    }
    return await this.hotelPlanRepository.findOne({
      where: { id },
    });
  }
}
