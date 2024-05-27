import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Location } from 'src/modules/location/entities/location.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('taxi')
export class Taxi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cost4Seats: number;

  @Column()
  cost7Seats: number;

  @Column()
  cost16Seats: number;

  @Column()
  @IsBoolean()
  active: boolean;

  @Column()
  @IsNumber()
  type: number;

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

  @ManyToOne(() => Location, (location) => location.taxi_stage_start)
  @JoinColumn({ name: 'stage_start_id', referencedColumnName: 'id' })
  stageStart: Location;

  @ManyToOne(() => Location, (location) => location.taxi_destination)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Location;

  // @OneToMany(() => TaxiPlan, (taxiPlan) => taxiPlan?.taxiService)
  // taxiPlan: TaxiPlan[];
}
