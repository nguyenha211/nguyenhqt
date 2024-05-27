import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { AirTicket } from '../air_ticket/entities/air_ticket.entity';
import { LocationService } from '../location/location.service';
import { TravelRequest } from '../travel-requests/entities/travel-request.entity';
import { AirTicketPlan } from './entities/air_ticket_plan.entity';
import { CreateAirTicketPlanDto } from './dto/create-air_ticket_plan.dto';
import { getCostDto } from 'src/common/base/get-cost-by-location.dto';
import { GetTravelRequestDto } from 'src/common/base/get-travel-request.dto';
import { SelectedPlanDto } from '../../common/base/selected-plan.dto';
import { UpdateAirTicketPlanDto } from './dto/update-air_ticket_plan.dto';
import * as _ from 'lodash';
@Injectable()
export class AirTicketPlanService {
  constructor(
    @InjectRepository(AirTicketPlan)
    private readonly airTicketPlanRepository: Repository<AirTicketPlan>,
    // @InjectRepository(Location)
    // private readonly locationRepository: Repository<Location>,
    @InjectRepository(TravelRequest)
    private readonly travelRequestRepository: Repository<TravelRequest>,
    @InjectRepository(AirTicket)
    private readonly airTicketRepository: Repository<AirTicket>,

    private locationServices: LocationService,
  ) {}

  async getPriceAirTicket(input: getCostDto) {
    const { destinationId, stageStartId } = input;
    const airTicketPriceInDB = await this.airTicketRepository.findOne({
      where: {
        stageStartId,
        destinationId,
      },
    });
    return {
      airTicketCost: airTicketPriceInDB.cost,
      // id: airTicketPriceInDB.id,
    };
  }

  async createAirTicketPlan(
    input: CreateAirTicketPlanDto,
    ticketRequest: GetTravelRequestDto,
  ) {
    const { id, requestCode } = ticketRequest;

    const {
      airTicketPrice,
      destinationId,
      endDate,
      stageStartId,
      startDate,
      ticketCondition,
    } = input;
    const stageStart =
      await this.locationServices.checkExistLocationById(stageStartId);

    const destination =
      await this.locationServices.checkExistLocationById(destinationId);

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
    if (!stageStart || !destination) {
      throw new HttpException('Không tìm thấy địa điểm', HttpStatus.NOT_FOUND);
    }

    return await this.airTicketPlanRepository.save({
      airTicketPrice,
      startDate,
      endDate,
      stageStartId: stageStart.id,
      stageStartName: stageStart.locationName,
      destinationId: destination.id,
      destinationName: destination.locationName,
      ticketCondition,
      airTicketRequestId: travelRequest.id,
      isSelected: false,
    });
  }

  async isSelectedRequestPlan(input: SelectedPlanDto, user: any) {
    const { ticketPlanId, isSelected } = input;
    const existPlan = await this.airTicketPlanRepository.findOneBy({
      id: ticketPlanId,
    });
    const travelRequest = await this.travelRequestRepository.findOne({
      select: { isMain: true },
      where: { id: ticketPlanId },
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
    await this.airTicketPlanRepository.update(existPlan.id, {
      isSelected,
    });
    const otherPlans = await this.airTicketPlanRepository.find({
      where: { id: Not(ticketPlanId) },
    });
    await Promise.all(
      otherPlans.map((plan) =>
        this.airTicketPlanRepository.update(plan.id, { isSelected: false }),
      ),
    );
    return await this.airTicketPlanRepository.findOneBy({
      id: ticketPlanId,
    });
  }
  async updatePlan(input: UpdateAirTicketPlanDto, id: number) {
    const {
      airTicketPrice,
      destinationId,
      endDate,
      stageStartId,
      startDate,
      ticketCondition,
    } = input;
    const stageStart =
      await this.locationServices.checkExistLocationById(stageStartId);

    const destination =
      await this.locationServices.checkExistLocationById(destinationId);

    if (!stageStart || !destination) {
      throw new HttpException('Không tìm thấy địa điểm', HttpStatus.NOT_FOUND);
    }
    const checkExistPlan = await this.airTicketPlanRepository.findOne({
      where: { id },
    });
    await this.airTicketPlanRepository.update(checkExistPlan?.id, {
      airTicketPrice,
      startDate,
      endDate,
      stageStartId: stageStart.id,
      stageStartName: stageStart.locationName,
      destinationId: destination.id,
      destinationName: destination.locationName,
      ticketCondition: _.isNil(ticketCondition) ? null : ticketCondition,
      isSelected: checkExistPlan?.isSelected,
    });
    return await this.airTicketPlanRepository.findOne({
      where: { id },
    });
  }
}
