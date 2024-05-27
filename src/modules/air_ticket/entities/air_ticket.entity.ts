import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';
import { Location } from 'src/modules/location/entities/location.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('air_ticket')
export class AirTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsNumber()
  cost: number;

  @Column({ nullable: false })
  @IsBoolean()
  active: boolean;

  @Column({ nullable: false })
  @IsNumber()
  @Min(1)
  @Max(2)
  type: number;

  @Column({ name: 'stage_start_id', nullable: false })
  @IsNumber()
  stageStartId: number;

  @Column({ name: 'stage_start_name', nullable: false })
  @IsString()
  stageStartName: string;

  @Column({ name: 'destination_id', nullable: false })
  @IsNumber()
  destinationId: number;

  @Column({ name: 'destination_name', nullable: false })
  @IsString()
  destinationName: string;

  @ManyToOne(() => Location, (location) => location.airticket_stage_start)
  @JoinColumn({ name: 'stage_start_id', referencedColumnName: 'id' })
  stageStart: Location;

  @ManyToOne(() => Location, (location) => location.airticket_destination)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Location;

  // @OneToMany(
  //   () => AirTicketPlan,
  //   (airTicketPlan) => airTicketPlan.airTicketServices,
  // )
  // airTicketPlan: AirTicketPlan[];
}
