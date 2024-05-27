import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTravelRequestDto } from 'src/common/base/get-travel-request.dto';
import { Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import { TaxiService } from '../taxi/taxi.service';
import { TravelRequest } from '../travel-requests/entities/travel-request.entity';
import { CreateTaxiPlanDto } from './dto/create-taxi_plan.dto';
import { UpdateTaxiPlanDto } from './dto/update-taxi_plan.dto';
import { TaxiPlan } from './entities/taxi_plan.entity';

@Injectable()
export class TaxiPlanService {
  constructor(
    @InjectRepository(TaxiPlan)
    private taxiPlanRepository: Repository<TaxiPlan>,

    @InjectRepository(TravelRequest)
    private travelRequestRepository: Repository<TravelRequest>,

    private locationServices: LocationService,
    private taxiServices: TaxiService,
  ) {}

  async create(query: GetTravelRequestDto, input: CreateTaxiPlanDto) {
    const { id, requestCode } = query;
    const { destinationId, endDate, note, stageStartId, startDate, direct } =
      input;
    const travelRequest = await this.travelRequestRepository.findOne({
      where: { id, requestCode },
    });
    const stageStart =
      await this.locationServices.checkExistLocationById(stageStartId);

    const destination =
      await this.locationServices.checkExistLocationById(destinationId);

    // const taxiService = await this.taxiServices.checkLocationAndReturnCost(
    //   stageStartId,
    //   destinationId,
    // );

    if (!travelRequest) {
      throw new HttpException(
        `Không tìm thấy ${requestCode}`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!stageStart || !destination) {
      throw new HttpException('Không tìm thấy địa điểm', HttpStatus.NOT_FOUND);
    }
    return await this.taxiPlanRepository.save({
      direct,
      startDate,
      endDate,
      note,
      stageStartId: stageStart.id,
      stageStartName: stageStart.locationName,
      destinationId: destination.id,
      destinationName: destination.locationName,
      taxiRequestId: travelRequest.id,
      isSelected: false,
    });
  }

  async updatePlan(input: UpdateTaxiPlanDto, id: number) {
    const { destinationId, direct, endDate, note, stageStartId, startDate } =
      input;
    const stageStart =
      await this.locationServices.checkExistLocationById(stageStartId);

    const destination =
      await this.locationServices.checkExistLocationById(destinationId);

    if (!stageStart || !destination) {
      throw new HttpException('Không tìm thấy địa điểm', HttpStatus.NOT_FOUND);
    }
    const checkExistPlan = await this.taxiPlanRepository.findOne({
      where: { id },
    });
    await this.taxiPlanRepository.update(checkExistPlan?.id, {
      direct,
      startDate,
      endDate,
      stageStartId: stageStart.id,
      stageStartName: stageStart.locationName,
      destinationId: destination.id,
      destinationName: destination.locationName,
      note,
      isSelected: checkExistPlan?.isSelected,
    });
    return await this.taxiPlanRepository.findOne({
      where: { id },
    });
  }
}
