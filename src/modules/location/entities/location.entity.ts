import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { BaseEntity } from 'src/common/base/create-update-base.dto';
import { AirTicket } from 'src/modules/air_ticket/entities/air_ticket.entity';
import { AirTicketPlan } from 'src/modules/air_ticket_plan/entities/air_ticket_plan.entity';
import { Allowance } from 'src/modules/allowance/entities/allowance.entity';
import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { HotelPlan } from 'src/modules/hotel_plan/entities/hotel_plan.entity';
import { Journey } from 'src/modules/journey/entities/journey.entity';
import { Taxi } from 'src/modules/taxi/entities/taxi.entity';
import { TaxiPlan } from 'src/modules/taxi_plan/entities/taxi_plan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('location')
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @Column({ nullable: false, default: 1 })
  @IsInt()
  @Min(1)
  @Max(2)
  typeLocation: number;

  @OneToMany(() => AirTicket, (airTicket) => airTicket.stageStart)
  airticket_stage_start: AirTicket[];

  @OneToMany(() => AirTicket, (airTicket) => airTicket.destination)
  airticket_destination: AirTicket[];

  @OneToMany(() => Allowance, (allowance) => allowance.stageStart)
  allowance_stage_start: Allowance[];

  @OneToMany(() => Allowance, (allowance) => allowance.destination)
  allowance_destination: Allowance[];

  @OneToMany(() => Hotel, (hotel) => hotel.destination) // Thêm dòng này
  hotel_destination: Hotel[];

  @OneToMany(() => Taxi, (taxi) => taxi.stageStart)
  taxi_stage_start: Taxi[];

  @OneToMany(() => Taxi, (taxi) => taxi.destination)
  taxi_destination: Taxi[];

  @OneToMany(() => Journey, (journey) => journey.stageStart)
  journey_stageStart: Journey[];

  @OneToMany(() => Journey, (journey) => journey.destination)
  journey_destination: Journey[];

  @OneToMany(() => AirTicketPlan, (airTicketPlan) => airTicketPlan.stageStart)
  air_ticket_plan_stage_start: AirTicketPlan[];

  @OneToMany(() => AirTicketPlan, (airTicketPlan) => airTicketPlan.destination)
  air_ticket_plan_destination: AirTicketPlan[];

  @OneToMany(() => HotelPlan, (hotelPlan) => hotelPlan?.location)
  hotelPlan: HotelPlan[];

  @OneToMany(() => TaxiPlan, (taxiPlane) => taxiPlane?.stageStart)
  taxiPlan_stageStart: TaxiPlan[];

  @OneToMany(() => TaxiPlan, (taxiPlane) => taxiPlane?.destination)
  taxiPlan_destionation: TaxiPlan[];
}
