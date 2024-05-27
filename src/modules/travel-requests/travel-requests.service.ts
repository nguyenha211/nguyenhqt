import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { ETypeRequest } from 'src/common/type-request.enum';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { AirTicketService } from '../air_ticket/air_ticket.service';
import { AllowanceService } from '../allowance/allowance.service';
import { HotelService } from '../hotel/hotel.service';
import { Journey } from '../journey/entities/journey.entity';
import { OtherCost } from '../other-cost/entities/other-cost.entity';
import { TaxiService } from '../taxi/taxi.service';
import { TravelParticipant } from '../travel-participants/entities/travel-participant.entity';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { CalculatePlanDto } from './dto/calculate-plan.dto';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
import { GetDetailTravelRequestDto } from './dto/get-detail-travel-request.dto';
import { GetListTravelRequestDto } from './dto/get-travel-request.dto';
import { UpdateTravelRequestDto } from './dto/update-travel-request.dto';
import { TravelRequest } from './entities/travel-request.entity';
import { AirTicketPlan } from '../air_ticket_plan/entities/air_ticket_plan.entity';
import { HotelPlan } from '../hotel_plan/entities/hotel_plan.entity';
import { UsersService } from '../users/users.service';
import { TaxiPlan } from '../taxi_plan/entities/taxi_plan.entity';
@Injectable()
export class TravelRequestsService {
  constructor(
    @InjectRepository(TravelRequest)
    private readonly travelRequestRepository: Repository<TravelRequest>,
    @InjectRepository(OtherCost)
    private readonly otherCostRepository: Repository<OtherCost>,
    @InjectRepository(TravelParticipant)
    private readonly travelParticipantRepository: Repository<TravelParticipant>,
    @InjectRepository(Journey)
    private readonly journeyRepository: Repository<Journey>,

    @InjectRepository(AirTicketPlan)
    private readonly airTicketPlanRepository: Repository<AirTicketPlan>,

    @InjectRepository(HotelPlan)
    private readonly hotelPlanRepository: Repository<HotelPlan>,

    @InjectRepository(TaxiPlan)
    private readonly taxiPlanRepository: Repository<TaxiPlan>,

    private userService: UsersService,
    private taxiServices: TaxiService,
    private allowanceServices: AllowanceService,
    private hotelServices: HotelService,
    private airTicketServices: AirTicketService,
  ) {}
  async calculatePlan(calculatePlanDto: CalculatePlanDto) {
    const { journey, otherCost, userCode } = calculatePlanDto;
    // Tổng chi phí
    const totalUser = userCode?.length + 1;
    const costInItemJourney = [];
    if (_.isArray(journey)) {
      for (const items of journey) {
        const {
          stageStartId,
          destinationId,
          isAirTicketSpecialCost,
          isAllowanceSpecialCost,
          isHotelSpecialCost,
          isUsedAirTicket,
          isUsedHotel,
          isUsedTaxi,
        } = items ?? {};
        const taxi = await this.taxiServices.checkLocationAndReturnCost(
          stageStartId,
          destinationId,
        );
        const allowance =
          await this.allowanceServices.checkLocationAndReturnCost(
            stageStartId,
            destinationId,
          );
        const hotel =
          await this.hotelServices.checkLocationAndReturnCost(destinationId);

        const airTicket =
          await this.airTicketServices.checkLocationAndReturnCost(
            stageStartId,
            destinationId,
          );
        let taxiCost;
        const { cost: allowanceCost, type: typeAllowance } = allowance;
        const { cost: airTicketCost, type: typeAirticket } = airTicket;
        const { costSingleRoom, costDoubleRoom } = hotel;

        const doubleRooms = Math.floor(totalUser / 2);

        const singleRooms = totalUser % 2;

        const hotelCost =
          doubleRooms * costDoubleRoom + singleRooms * costSingleRoom;

        const totalRoom = singleRooms + doubleRooms;

        const { cost4Seats, cost7Seats, cost16Seats, type: typeTaxi } = taxi;

        if (totalUser < 5) {
          taxiCost = cost4Seats;
        } else if (totalUser > 4 && totalUser < 8) {
          taxiCost = cost7Seats;
        } else {
          taxiCost = cost16Seats;
        }
        const currency =
          (await this.checkTypeLocation(
            typeAllowance,
            typeAirticket,
            typeTaxi,
          )) === 1
            ? 'VNĐ'
            : 'USD';

        const hotelCostDetail: any =
          isUsedHotel === true
            ? {
                totalRoom,
                hotelCost,
                isHotelSpecialCost,
                isTotalHotelCost: hotelCost + isHotelSpecialCost,
              }
            : 0;
        const airTicketCostDetail: any =
          isUsedAirTicket === true
            ? {
                airTicketCost: totalUser * airTicketCost,
                isAirTicketSpecialCost,
                isTotalAirTicketCost:
                  totalUser * airTicketCost + isAirTicketSpecialCost,
              }
            : 0;
        const allowanceCostDetail = {
          allowanceCost: totalUser * allowanceCost,
          isAllowanceSpecialCost,
          isTotalAllowanceCost:
            totalUser * allowanceCost + isAllowanceSpecialCost,
        };

        costInItemJourney.push({
          currency,
          hotelCostDetail,
          airTicketCostDetail,
          allowanceCostDetail,
          taxiCost: isUsedTaxi ? taxiCost : 0,
          // hotel:
          //   isUsedHotel === true
          //     ? {
          //         totalRoom,
          //         hotelCost,
          //         isHotelSpecialCost,
          //         isTotalHotelCost: hotelCost + isHotelSpecialCost,
          //       }
          //     : 0,
          // allowance: {
          //   allowanceCost: totalUser * allowanceCost,
          //   isAllowanceSpecialCost,
          //   isTotalAllowanceCost:
          //     totalUser * allowanceCost + isAllowanceSpecialCost,
          // },
          // airTicket: isUsedAirTicket
          //   ? {
          //       airTicketCost: totalUser * airTicketCost,
          //       isAirTicketSpecialCost,
          //       isTotalAirTicketCost:
          //         totalUser * airTicketCost + isAirTicketSpecialCost,
          //     }
          //   : 0,
          totalJourneyCost:
            allowanceCostDetail?.isTotalAllowanceCost +
            (isUsedAirTicket ? airTicketCostDetail?.isTotalAirTicketCost : 0) +
            (isUsedHotel ? hotelCostDetail?.isTotalHotelCost : 0) +
            (isUsedTaxi ? taxiCost : 0),
        });
      }
    }

    const totalJourneyCost = await costInItemJourney.reduce(
      (sum, cost) => sum + cost.totalJourneyCost,
      0,
    );

    const otherCostsTotal = await otherCost.reduce(
      (sum, cost) => sum + cost.value,
      0,
    );
    const otherItemCost = await _.map(otherCost, (items) => {
      const { value, content, currency } = items;
      return { value, content, currency };
    });
    const totalCost = await (totalJourneyCost + otherCostsTotal);
    return await {
      totalCost,
      costInItemJourney,
      otherCost: otherItemCost,
      totalOtherCost: otherCostsTotal,
    };
  }

  async createTravelRequest(input: CreateTravelRequestDto) {
    const {
      journey,
      otherCost,
      userCode,
      isMain,
      companyInvitation,
      journeyType,
      targetType,
      otherDepartment,
      otherProject,
      targetDetail,
      travelType,
    } = input;
    const travelRequest = await this.travelRequestRepository.save({
      targetType,
      targetDetail,
      companyInvitation,
      otherProject,
      otherDepartment,
      travelType,
      journeyType,
      status: 1,
      currency: travelType === 1 ? 'VND' : 'USD',
      isMain,
      typeRequest: ETypeRequest.TRAVEL_REQUEST,
    });
    const { id } = travelRequest;
    const total = await this.travelRequestRepository.countBy({
      parent: IsNull(),
    });
    const requestCode = `YC${total.toString().padStart(6, '0')}`;
    travelRequest.requestCode = requestCode;
    await this.travelRequestRepository.save(travelRequest);

    let air_ticketCreated = false;
    let hotel_ticketCreated = false;
    let taxi_ticketCreated = false;

    const journeyItems = journey.map((item) => {
      const { isUsedAirTicket, isUsedHotel, isUsedTaxi } = item;

      console.log('Journey item:', item);
      console.log('air_ticketCreated:', air_ticketCreated);

      if (isUsedAirTicket && !air_ticketCreated) {
        console.log('Creating air ticket...');
        const airTicketRequestCode = `${requestCode}_AIR_TICKET`;
        const subTravelRequest = new TravelRequest();
        subTravelRequest.requestCode = airTicketRequestCode;
        subTravelRequest.targetType = targetType;
        subTravelRequest.targetDetail = targetDetail;
        subTravelRequest.companyInvitation = companyInvitation;
        subTravelRequest.otherProject = otherProject;
        subTravelRequest.otherDepartment = otherDepartment;
        subTravelRequest.travelType = travelType;
        subTravelRequest.journeyType = journeyType;
        subTravelRequest.status = 1;
        subTravelRequest.currency = travelType === 1 ? 'VND' : 'USD';
        subTravelRequest.isMain = isMain;
        subTravelRequest.typeRequest = ETypeRequest.AIR_TICKET;
        subTravelRequest.parent = travelRequest;
        subTravelRequest.parentId = travelRequest.id;
        this.travelRequestRepository.save(subTravelRequest);
        air_ticketCreated = true;
        console.log('Air ticket created:', air_ticketCreated);
      }

      console.log('hotel_ticketCreated:', hotel_ticketCreated);
      if (isUsedHotel && !hotel_ticketCreated) {
        console.log('Creating hotel ticket...');
        const hotelRequestCode = `${requestCode}_HOTEL`;
        const subTravelRequest = new TravelRequest();
        subTravelRequest.requestCode = hotelRequestCode;
        subTravelRequest.targetType = targetType;
        subTravelRequest.targetDetail = targetDetail;
        subTravelRequest.companyInvitation = companyInvitation;
        subTravelRequest.otherProject = otherProject;
        subTravelRequest.otherDepartment = otherDepartment;
        subTravelRequest.travelType = travelType;
        subTravelRequest.journeyType = journeyType;
        subTravelRequest.status = 1;
        subTravelRequest.currency = travelType === 1 ? 'VND' : 'USD';
        subTravelRequest.isMain = isMain;
        subTravelRequest.typeRequest = ETypeRequest.HOTEL;
        subTravelRequest.parent = travelRequest;
        subTravelRequest.parentId = travelRequest.id;
        this.travelRequestRepository.save(subTravelRequest);
        hotel_ticketCreated = true;
        console.log('Hotel ticket created:', hotel_ticketCreated);
      }

      console.log('taxi_ticketCreated:', taxi_ticketCreated);
      if (isUsedTaxi && !taxi_ticketCreated) {
        console.log('Creating taxi ticket...');
        const taxiRequestCode = `${requestCode}_TAXI`;
        const subTravelRequest = new TravelRequest();
        subTravelRequest.requestCode = taxiRequestCode;
        subTravelRequest.targetType = targetType;
        subTravelRequest.targetDetail = targetDetail;
        subTravelRequest.companyInvitation = companyInvitation;
        subTravelRequest.otherProject = otherProject;
        subTravelRequest.otherDepartment = otherDepartment;
        subTravelRequest.travelType = travelType;
        subTravelRequest.journeyType = journeyType;
        subTravelRequest.status = 1;
        subTravelRequest.currency = travelType === 1 ? 'VND' : 'USD';
        subTravelRequest.isMain = isMain;
        subTravelRequest.typeRequest = ETypeRequest.TAXI;
        subTravelRequest.parent = travelRequest;
        subTravelRequest.parentId = travelRequest.id;
        this.travelRequestRepository.save(subTravelRequest);
        taxi_ticketCreated = true;
        console.log('Taxi ticket created:', taxi_ticketCreated);
      }

      return {
        ...item,
        travelRequestId: id,
      };
    });
    await this.journeyRepository.save(journeyItems);

    const travelParticipantItems = userCode.map((code) => ({
      userCode: code,
      travelRequestId: id,
    }));
    await this.travelParticipantRepository.save(travelParticipantItems);

    const otherCostItems = otherCost.map((cost) => ({
      ...cost,
      travelRequestId: id,
    }));
    await this.otherCostRepository.save(otherCostItems);

    const query = [
      {
        id: id,
      },
    ];
    const data = await this.travelRequestRepository.find({
      select: {
        id: true,
        isMain: true,
        journeyType: true,
        journey: true,
        otherCost: true,
        otherDepartment: true,
        otherProject: true,
        status: true,
        targetDetail: true,
        targetType: true,
        travel_participants: true,
        travelType: true,
        updatedAt: true,
        updatedBy: true,
        createdAt: true,
        createdBy: true,
        currency: true,
      },
      relations: {
        otherCost: true,
        journey: true,
        travel_participants: true,
        chilrens: true,
      },
      where: query,
    });
    return data;
  }

  async updateTravelRequest(
    query: GetDetailTravelRequestDto,
    input: UpdateTravelRequestDto,
  ) {
    const { id, requestCode } = query;
    const {
      companyInvitation,
      isMain,
      journey,
      journeyType,
      otherCost,
      otherDepartment,
      otherProject,
      targetDetail,
      targetType,
      travelType,
      userCode,
    } = input;
    const travelRequest = await this.travelRequestRepository.findOne({
      where: {
        id,
        requestCode,
      },
    });
    const { parentId } = travelRequest;

    // check id if id is child -> announce to user just edit request parent
    if (!_.isNil(parentId)) {
      const findTravelRequestParentByParentId =
        await this.travelRequestRepository.findOne({
          where: { id: parentId },
        });
      const { requestCode: requestCodeOfParent } =
        findTravelRequestParentByParentId;
      throw new HttpException(
        `${requestCode} không được sửa - chỉ được chỉnh sửa ${requestCodeOfParent}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.travelRequestRepository.update(id, {
      targetType,
      targetDetail,
      companyInvitation,
      otherProject,
      otherDepartment,
      travelType,
      journeyType,
      status: 5,
      currency: travelType === 1 ? 'VND' : 'USD',
      isMain,
      typeRequest: ETypeRequest.TRAVEL_REQUEST,
    });

    let air_ticketCreated = false;
    let hotel_ticketCreated = false;
    let taxi_ticketCreated = false;

    const journeyItems = journey.map((item) => {
      const { isUsedAirTicket, isUsedHotel, isUsedTaxi } = item;
      if (isUsedAirTicket) {
        air_ticketCreated = true;
      }
      if (isUsedHotel) {
        hotel_ticketCreated = true;
      }
      if (isUsedTaxi) {
        taxi_ticketCreated = true;
      }
      return {
        ...item,
        travelRequestId: id,
      };
    });
    await this.journeyRepository.delete({ travelRequestId: id });
    await this.journeyRepository.save(journeyItems);

    const airTicketRequest = await this.travelRequestRepository.findOneBy({
      parentId: id,
      typeRequest: ETypeRequest.AIR_TICKET,
    });

    if (air_ticketCreated === false) {
      await this.travelRequestRepository.delete(airTicketRequest);
    } else {
      const { id: airTicketRequestId } = airTicketRequest;
      await this.travelRequestRepository.update(airTicketRequestId, {
        targetType,
        targetDetail,
        companyInvitation,
        otherProject,
        otherDepartment,
        travelType,
        journeyType,
        status: 5,
        currency: travelType === 1 ? 'VND' : 'USD',
        isMain,
        typeRequest: ETypeRequest.AIR_TICKET,
        parent: travelRequest,
        parentId: travelRequest?.id,
      });
    }
    const hotelRequest = await this.travelRequestRepository.findOneBy({
      parentId: id,
      typeRequest: ETypeRequest.HOTEL,
    });

    if (hotel_ticketCreated === false) {
      await this.travelRequestRepository.delete(hotelRequest);
    } else {
      const { id: hotelRequestId } = hotelRequest;
      await this.travelRequestRepository.update(hotelRequestId, {
        targetType,
        targetDetail,
        companyInvitation,
        otherProject,
        otherDepartment,
        travelType,
        journeyType,
        status: 5,
        currency: travelType === 1 ? 'VND' : 'USD',
        isMain,
        typeRequest: ETypeRequest.HOTEL,
        parent: travelRequest,
        parentId: travelRequest?.id,
      });
    }

    const taxiRequest = await this.travelRequestRepository.findOneBy({
      parentId: id,
      typeRequest: ETypeRequest.TAXI,
    });
    if (taxi_ticketCreated === false) {
      await this.travelRequestRepository.delete(taxiRequest);
    } else {
      const { id: taxiRequestId } = taxiRequest;
      await this.travelRequestRepository.update(taxiRequestId, {
        targetType,
        targetDetail,
        companyInvitation,
        otherProject,
        otherDepartment,
        travelType,
        journeyType,
        status: 5,
        currency: travelType === 1 ? 'VND' : 'USD',
        isMain,
        typeRequest: ETypeRequest.TAXI,
        parent: travelRequest,
        parentId: travelRequest?.id,
      });
    }

    // Update travel participants
    const existingParticipants = await this.travelParticipantRepository.find({
      where: { travelRequestId: id },
    });

    const newParticipants = userCode.map((code) => ({
      userCode: code,
      travelRequestId: id,
    }));

    const participantsToRemove = existingParticipants.filter(
      (ep) => !userCode.includes(ep.userCode),
    );

    const participantsToAdd = newParticipants.filter(
      (np) => !existingParticipants.some((ep) => ep.userCode === np.userCode),
    );

    await this.travelParticipantRepository.remove(participantsToRemove);
    await this.travelParticipantRepository.save(participantsToAdd);

    await this.otherCostRepository.delete({ travelRequestId: id });
    const otherCostItems = otherCost.map((cost) => ({
      ...cost,
      travelRequestId: id,
    }));
    await this.otherCostRepository.save(otherCostItems);

    const updatedTravelRequest = await this.travelRequestRepository.findOne({
      select: {
        id: true,
        isMain: true,
        journeyType: true,
        journey: true,
        otherCost: true,
        otherDepartment: true,
        otherProject: true,
        status: true,
        targetDetail: true,
        targetType: true,
        travel_participants: true,
        travelType: true,
        updatedAt: true,
        updatedBy: true,
        createdAt: true,
        createdBy: true,
        currency: true,
      },
      where: { id, requestCode },
      relations: [
        'user',
        'chilrens',
        'journey',
        'travel_participants',
        'otherCost',
      ],
    });

    return updatedTravelRequest;
  }

  async getListTravelRequest(
    input: GetListTravelRequestDto,
    pagination: PaginationDto,
    user: any,
  ) {
    const { searchText } = input;
    const { page, pageSize } = pagination;
    const { username } = user;
    const permissionOfUserRequest =
      await this.userService.findByUsernameAndReturnPermission(username);

    const query: FindOptionsWhere<TravelRequest>[] = [
      {
        requestCode: ILike(`%${searchText || ''}`),
        isMain: !_.includes(permissionOfUserRequest, 'ADMIN') ? username : null,

        parent: IsNull(),
      },
    ];
    const [list, total] = await this.travelRequestRepository.findAndCount({
      where: query,
      // relations: {
      //   user: true,
      //   travel_participants: true,
      //   otherCost: true,
      //   journey: true,
      //   chilrens: true,
      // },
      relations: [
        'chilrens',
        'user',
        'travel_participants',
        'otherCost',
        'journey',
      ],
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const lastPage = Math.ceil(total / pageSize);
    const currentPage = +parseInt(page as any);
    const nextPage: number =
      currentPage + 1 > lastPage ? null : currentPage + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;

    const formattedList = await Promise.all(
      _.map(list, async (item) => {
        const journeyString = item.journey
          .map((j, index) => {
            return `C${index + 1}: ${j.stageStartName} - ${j.destinationName}`;
          })
          .join('\n');

        const userCodeOfIsMain = item.user.userCode;
        const participantUserCodes = item.travel_participants.map(
          (p) => p.userCode,
        );
        const allUserCodes = [userCodeOfIsMain, ...participantUserCodes].join(
          ', ',
        );

        const travelParticipants = await this.travelParticipantRepository.find({
          where: { travelRequestId: item.id },
          relations: ['users'],
        });
        const participantUserDetails = travelParticipants.map((p) => p.users);

        // Combine usex details of isMaxin with participant user details
        const allUserDetails = [item.user, ...participantUserDetails];
        const childrens = await Promise.all(
          _.map(item?.chilrens, async (child) => {
            const { id } = child;
            return await this.travelRequestRepository.findOne({
              where: { id },
            });
          }),
        );
        // Remove refreshToken from user details
        const sanitizedUserDetails = allUserDetails.map((user) => {
          const { refreshToken, ...sanitizedUser } = user;
          return sanitizedUser;
        });
        const formattedChild = _.map(childrens, (child) => {
          return {
            id: child.id,
            requestCode: child.requestCode,
            createdAt: child.createdAt,
            department: item.user.departmentCode,
            typeRequest: child.typeRequest,
            status: child.status,
            journeyString,
            users: sanitizedUserDetails,
          };
        });

        return {
          id: item.id,
          isMain: item?.isMain,
          requestCode: item.requestCode,
          createdAt: item.createdAt,
          department: item.user.departmentCode,
          typeRequest: item.typeRequest,
          journeyString,
          users: {
            userCodeList: allUserCodes,
            userDetailList: sanitizedUserDetails,
          },

          status: item.status,
          childrens: formattedChild,
        };
      }),
    );

    return {
      list: formattedList,
      pagination: {
        currentPage,
        totalElements: total,
        lastPage,
        nextPage,
        previousPage,
      },
    };
  }

  async getDetailTravelRequest(input: GetDetailTravelRequestDto, user: any) {
    const { id, requestCode } = input;
    const { username } = user;

    const permissionOfUserRequest =
      await this.userService.findByUsernameAndReturnPermission(username);

    const travelPaper = await this.travelRequestRepository.findOne({
      where: { requestCode, id },
      relations: {
        user: true,
      },
    });

    const { parentId, isMain } = travelPaper;

    const journey = await this.journeyRepository.find({
      where: { travelRequestId: parentId ?? id },
    });

    const participant = await this.travelParticipantRepository.find({
      where: {
        travelRequestId: parentId ?? id,
      },
      relations: { users: true },
    });

    const otherCost = await this.otherCostRepository.find({
      where: {
        travelRequestId: parentId ?? id,
      },
    });

    // Loại bỏ refreshToken từ user của travelPaper
    const sanitizedUser = { ...travelPaper.user };
    delete sanitizedUser.refreshToken;

    // Loại bỏ refreshToken từ users của participant
    const sanitizedParticipants = participant.map((p) => {
      const sanitizedUser = { ...p.users };
      delete sanitizedUser.refreshToken;
      return { ...p, users: sanitizedUser };
    });

    const { status } = travelPaper;

    if (_.isNil(parentId)) {
      return {
        function: {
          isViewHandler: _.includes(permissionOfUserRequest, 'ADMIN')
            ? true
            : false,
          isViewCreator: _.includes(isMain, username) ? true : false,
          isCancel: status === 4 ? true : false,
          isAprrove: status === 2 ? true : false,
          isReject: status === 3 ? true : false,
          isEdited: status === 5 ? true : false,
        },
        travelPaper: {
          ...travelPaper,
          user: sanitizedUser,
        },
        journey,
        participant: sanitizedParticipants,
        otherCost,
      };
    } else {
      const { typeRequest } = travelPaper;
      const airTicketPlan = await this.airTicketPlanRepository.find({
        where: {
          airTicketRequestId: id,
        },
      });
      const hotelPlan = await this.hotelPlanRepository.find({
        where: {
          hotelRequestId: id,
        },
      });
      const taxiPlan = await this.taxiPlanRepository.find({
        where: {
          taxiRequestId: id,
        },
      });
      return {
        function: {
          isViewHandler: _.includes(permissionOfUserRequest, 'ADMIN')
            ? true
            : false,
          isViewCreator: !_.includes(permissionOfUserRequest, 'ADMIN')
            ? true
            : false,
          isCancel: status === 4 ? true : false,
          isAprrove: status === 2 ? true : false,
          isReject: status === 3 ? true : false,
          isEdited: status === 5 ? true : false,
        },
        travelPaper: {
          ...travelPaper,
          user: sanitizedUser,
        },
        journey,
        participant: sanitizedParticipants,
        otherCost,
        TicketPlan:
          typeRequest === ETypeRequest.AIR_TICKET
            ? airTicketPlan
            : typeRequest === ETypeRequest.HOTEL
              ? hotelPlan
              : taxiPlan,
      };
    }
  }

  async approveTravelRequest(
    query: GetDetailTravelRequestDto,
    input: ApproveRequestDto,
  ) {
    const { id, requestCode } = query;
    const { status: statusInInput, reason } = input;
    const travelRequest = await this.travelRequestRepository.findOne({
      where: { id, requestCode },
    });
    const { parentId } = travelRequest;
    if (_.isNil(parentId)) {
      const parentRequest = await this.travelRequestRepository.findOne({
        where: { id, requestCode },
        relations: ['chilrens'],
      });

      if (
        parentRequest &&
        parentRequest.chilrens &&
        parentRequest.chilrens.length > 0
      ) {
        for (const childRequest of parentRequest.chilrens) {
          const child = await this.travelRequestRepository.findOne({
            where: { id: childRequest.id },
          });
          const { status, requestCode } = child;
          if (status === 1 || status === 4) {
            throw new HttpException(
              `Vui lòng phê duyệt các đơn yêu cầu ${requestCode}`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }
    }
    if (statusInInput === 3 && _.isEmpty(reason)) {
      throw new HttpException(
        'Vui lòng nhập lý do từ chối',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (statusInInput === 2) {
      await this.travelRequestRepository.update(id, {
        status: statusInInput,
      });
    }
    if (statusInInput == 3 && !_.isEmpty(reason)) {
      await this.travelRequestRepository.update(id, {
        status: statusInInput,
        reasonReject: reason,
      });
    }
    return await this.travelRequestRepository.findOne({
      where: { id, requestCode },
      relations: ['user', 'chilrens'],
    });
  }

  async cancelTravelRequest(input: GetDetailTravelRequestDto) {
    const { id, requestCode } = input;

    const travelRequest = await this.travelRequestRepository.findOne({
      where: { id, requestCode },
    });

    await this.travelRequestRepository.update(id, {
      status: 4,
    });

    const { parentId } = travelRequest;
    if (_.isNil(parentId)) {
      const parentRequest = await this.travelRequestRepository.findOne({
        where: { id, requestCode },
        relations: ['chilrens'],
      });

      if (
        parentRequest &&
        parentRequest.chilrens &&
        parentRequest.chilrens.length > 0
      ) {
        for (const childRequest of parentRequest.chilrens) {
          await this.travelRequestRepository.update(childRequest.id, {
            status: 4,
          });
        }
      }
      const updatedTravelRequest = await this.travelRequestRepository.findOne({
        where: { id, requestCode },
        relations: ['user', 'chilrens'],
      });
      return updatedTravelRequest;
    }
    return await this.travelRequestRepository.findOne({
      where: { id, requestCode },
      relations: ['user'],
    });
  }

  async checkTypeLocation(
    typeAllowance: number,
    typeAirticket: number,
    typeTaxi: number,
  ) {
    if (_.isEqual(typeAllowance, typeAirticket, typeTaxi)) {
      return 1;
    } else {
      return 2;
    }
  }
}
