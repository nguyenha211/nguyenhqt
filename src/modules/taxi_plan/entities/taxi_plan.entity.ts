import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Location } from 'src/modules/location/entities/location.entity';
import { TravelRequest } from 'src/modules/travel-requests/entities/travel-request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('taxi_plan')
export class TaxiPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '1 - Đi | 2 - Về' })
  @IsNumber()
  @Min(1)
  @Max(2)
  direct: number;

  @Column()
  @IsDateString()
  startDate: string;

  @Column()
  @IsDateString()
  endDate: string;

  @Column()
  @IsString()
  note: string;

  @Column()
  @IsBoolean()
  isSelected: boolean;

  @Column({ name: 'stage_start_id' })
  stageStartId: number;

  @Column({ name: 'stage_start_name' })
  stageStartName: string;

  @Column({ name: 'destination_id' })
  destinationId: number;

  @Column({ name: 'destination_name' })
  destinationName: string;

  // @Column({ name: 'taxi_service_id' })
  // taxiServiceId: number;

  @Column({ name: 'taxi_request_id' })
  taxiRequestId: number;

  @ManyToOne(() => Location, (location) => location.taxiPlan_stageStart)
  @JoinColumn({ name: 'stage_start_id', referencedColumnName: 'id' })
  stageStart: Location;

  @ManyToOne(() => Location, (location) => location.taxiPlan_destionation)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Location;

  // @ManyToOne(() => Taxi, (taxiService) => taxiService.taxiPlan)
  // @JoinColumn({ name: 'taxi_service_id', referencedColumnName: 'id' })
  // taxiService: Taxi;

  @ManyToOne(() => TravelRequest, (taxiRequest) => taxiRequest?.taxiPlan)
  @JoinColumn({ name: 'taxi_request_id', referencedColumnName: 'id' })
  travelRequest: TravelRequest;
}
