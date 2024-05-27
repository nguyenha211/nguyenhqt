import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { HotelPlan } from 'src/modules/hotel_plan/entities/hotel_plan.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hotel')
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsString()
  @Length(0, 255, { message: 'tên khách sạn không được quá 255 ký tự' })
  hotelName: string;

  @Column()
  @IsNumber()
  costSingleRoom: number;

  @Column()
  @IsNumber()
  costDoubleRoom: number;

  @Column({ nullable: false })
  @IsEmail()
  hotelEmail: string;

  @Column({ nullable: false })
  @IsString()
  @Length(10, 11)
  phoneNumber: string;

  @Column()
  @IsBoolean()
  active: boolean;

  @Column({ name: 'destination_id', nullable: true })
  @IsNumber()
  destinationId: number;

  @Column({ name: 'destination_name', nullable: true })
  @IsString()
  destinationName: string;

  @ManyToOne(() => Location, (location) => location.hotel_destination)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Location;

  @OneToMany(() => HotelPlan, (hotelPlan) => hotelPlan.hotel)
  hotelPlan: HotelPlan[];
}
