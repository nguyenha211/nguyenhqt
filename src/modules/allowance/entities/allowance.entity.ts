import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';
import { Location } from 'src/modules/location/entities/location.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('allowance')
export class Allowance {
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

  @ManyToOne(() => Location, (location) => location.allowance_stage_start)
  @JoinColumn({ name: 'stage_start_id', referencedColumnName: 'id' })
  stageStart: Location;

  @ManyToOne(() => Location, (location) => location.allowance_destination)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Location;
}
