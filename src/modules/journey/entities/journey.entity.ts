import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { Location } from 'src/modules/location/entities/location.entity';
import { TravelRequest } from 'src/modules/travel-requests/entities/travel-request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('journey')
export class Journey {
  @PrimaryGeneratedColumn()
  journeyId: number;

  @Column({ nullable: false })
  @IsDateString()
  startDate: string;

  @Column({ nullable: false })
  @IsDateString()
  endDate: string;

  @Column()
  @IsNumber()
  isAllowanceCost: number;

  @Column()
  @IsString()
  isAllowanceSpecialNote: string;

  @Column()
  @IsNumber()
  isAllowanceSpecialCost: number;

  @Column()
  @IsBoolean()
  isUsedHotel: boolean;

  @Column()
  @IsString()
  isHotelNote: string;

  @Column()
  @IsNumber()
  isHotelCost: number;

  @Column()
  @IsString()
  isHotelSpecialNote: string;

  @Column()
  @IsNumber()
  isHotelSpecialCost: number;

  @Column()
  @IsBoolean()
  isUsedAirTicket: boolean;

  @Column()
  @IsString()
  isAirTicketNote: string;

  @Column()
  @IsNumber()
  isAirTicketCost: number;

  @Column()
  @IsString()
  isAirTicketSpecialNote: string;

  @Column()
  @IsNumber()
  isAirTicketSpecialCost: number;

  @Column()
  @IsBoolean()
  isUsedTaxi: boolean;

  @Column()
  @IsNumber()
  isTaxiCost: number;

  @Column({ name: 'stage_start_id', nullable: true })
  @IsNumber()
  stageStartId: number;

  @Column({ name: 'stage_start_name', nullable: true })
  @IsString()
  stageStartName: string;

  @Column({ name: 'destination_id', nullable: true })
  @IsNumber()
  destinationId: number;

  @Column({ name: 'destination_name', nullable: true })
  @IsString()
  destinationName: string;

  @Column({ name: 'travel_request_id' })
  travelRequestId: number;

  @ManyToOne(() => Location, (location) => location?.journey_stageStart)
  @JoinColumn({ name: 'stage_start_id', referencedColumnName: 'id' })
  stageStart: Location;

  @ManyToOne(() => Location, (location) => location.allowance_destination)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Location;

  @ManyToOne(() => TravelRequest, (travelRequest) => travelRequest?.journey)
  @JoinColumn({ name: 'travel_request_id', referencedColumnName: 'id' })
  travel_request: TravelRequest;
}
