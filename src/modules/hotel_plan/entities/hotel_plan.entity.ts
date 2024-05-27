import { IsDateString, IsNumber, IsString, Max, Min } from 'class-validator';
import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { TravelRequest } from 'src/modules/travel-requests/entities/travel-request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hotel_plan')
export class HotelPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(2)
  hotelType: number;

  @Column()
  @IsNumber()
  unitPrice: number;

  @Column()
  @IsNumber()
  totalRoom: number;

  @Column()
  @IsDateString()
  dayCheckin: string;

  @Column()
  isSelected: boolean;

  @Column()
  @IsDateString()
  dayCheckout: string;

  @Column({ nullable: true })
  @IsString()
  hotelAddress: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: number;

  @Column({ name: 'location_name', nullable: true })
  locationName: string;

  @Column({ name: 'hotel_id', nullable: true })
  hotelId: number;

  @Column({ name: 'hotel_name', nullable: true })
  hotelName: string;

  @Column({ name: 'hotel_request_id' })
  hotelRequestId: number;

  @ManyToOne(() => Location, (location) => location?.hotelPlan)
  @JoinColumn({ name: 'location_id', referencedColumnName: 'id' })
  location: Location[];

  @ManyToOne(() => Hotel, (hotel) => hotel.hotelPlan)
  @JoinColumn({ name: 'hotel_id', referencedColumnName: 'id' })
  hotel: Hotel;

  @ManyToOne(() => TravelRequest, (hotelRequest) => hotelRequest?.hotelPlan)
  @JoinColumn({ name: 'hotel_request_id', referencedColumnName: 'id' })
  travelRequest: TravelRequest;
}
