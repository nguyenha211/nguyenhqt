import { IsNumber, IsString } from 'class-validator';
import { TravelRequest } from 'src/modules/travel-requests/entities/travel-request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('other_cost')
export class OtherCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsString()
  content: string;

  @Column({ nullable: false })
  @IsNumber()
  value: number;

  @Column()
  @IsString()
  currency: string;

  @Column({ name: 'travel_request_id' })
  travelRequestId: number;

  @ManyToOne(() => TravelRequest, (travelRequest) => travelRequest?.otherCost)
  @JoinColumn({ name: 'travel_request_id', referencedColumnName: 'id' })
  travel_requests: TravelRequest;
}
