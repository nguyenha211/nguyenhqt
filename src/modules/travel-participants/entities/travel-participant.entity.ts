import { TravelRequest } from 'src/modules/travel-requests/entities/travel-request.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('travel_participants')
export class TravelParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_code', nullable: true })
  userCode: string;

  @Column({ name: 'travel_request_id' })
  travelRequestId: number;

  @ManyToOne(() => User, (user) => user?.travel_participants)
  @JoinColumn({ name: 'user_code', referencedColumnName: 'userCode' })
  users: User;

  @ManyToOne(
    () => TravelRequest,
    (travelRequest) => travelRequest?.travel_participants,
  )
  @JoinColumn({ name: 'travel_request_id', referencedColumnName: 'id' })
  travel_requests: TravelRequest;
}
