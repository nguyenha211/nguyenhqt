import { IsDateString, IsNumber, IsString } from 'class-validator';
import { Location } from 'src/modules/location/entities/location.entity';
import { TravelRequest } from 'src/modules/travel-requests/entities/travel-request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('air_ticket_plan')
export class AirTicketPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsDateString()
  startDate: string;

  @Column({ nullable: false })
  @IsDateString()
  endDate: string;

  @Column({ nullable: true })
  @IsString()
  ticketCondition: string;

  @Column()
  isSelected: boolean;

  @Column()
  @IsNumber()
  airTicketPrice: number;

  @Column({ name: 'stage_start_id' })
  stageStartId: number;

  @Column({ name: 'stage_start_name' })
  stageStartName: string;

  @Column({ name: 'destination_id' })
  destinationId: number;

  @Column({ name: 'destination_name' })
  destinationName: string;

  // @Column({ name: 'air_ticket_services_id' })
  // airTicketServicesId: number;

  @Column({ name: 'air_ticket_request_id' })
  airTicketRequestId: number;

  @ManyToOne(
    () => Location,
    (location) => location?.air_ticket_plan_stage_start,
  )
  @JoinColumn({ name: 'stage_start_id', referencedColumnName: 'id' })
  stageStart: Location;

  @ManyToOne(
    () => Location,
    (location) => location?.air_ticket_plan_destination,
  )
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Location;

  // @ManyToOne(
  //   () => AirTicket,
  //   (airTicketService) => airTicketService.airTicketPlan,
  // )
  // @JoinColumn({ name: 'air_ticket_services_id', referencedColumnName: 'id' })
  // airTicketServices: AirTicket;

  @ManyToOne(
    () => TravelRequest,
    (airTicketRequest) => airTicketRequest?.airTicketPlan,
  )
  @JoinColumn({ name: 'air_ticket_request_id', referencedColumnName: 'id' })
  airTicketRequest: TravelRequest;
}
