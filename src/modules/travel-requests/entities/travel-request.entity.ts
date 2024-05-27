import { IsNumber, IsString, Max, Min } from 'class-validator';
import { BaseEntity } from 'src/common/base/create-update-base.dto';
import { ETypeRequest } from 'src/common/type-request.enum';
import { AirTicketPlan } from 'src/modules/air_ticket_plan/entities/air_ticket_plan.entity';
import { HotelPlan } from 'src/modules/hotel_plan/entities/hotel_plan.entity';
import { Journey } from 'src/modules/journey/entities/journey.entity';
import { OtherCost } from 'src/modules/other-cost/entities/other-cost.entity';
import { TaxiPlan } from 'src/modules/taxi_plan/entities/taxi_plan.entity';
import { TravelParticipant } from 'src/modules/travel-participants/entities/travel-participant.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('travel_request')
@Tree('closure-table')
export class TravelRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  requestCode: string;

  @Column()
  @IsString()
  companyInvitation: string;

  @Column({
    enum: ETypeRequest,
  })
  typeRequest: ETypeRequest;

  @Column()
  @IsNumber()
  targetType: number;

  @Column()
  @IsString()
  targetDetail: string;

  @Column({ nullable: true })
  @IsNumber()
  otherProject: number;

  @Column({ nullable: true })
  @IsNumber()
  otherDepartment: number;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(2)
  travelType: number;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(3)
  journeyType: number;

  /**
   *  desc value of status {
   *  1 - 'Tạo mới'
   *  2 - 'Phê duyệt'
   *  3 - 'Từ chối'
   *  4 - 'Hủy'
   *  5 - 'Đã chỉnh sửa'
   * }
   */

  @Column()
  @IsNumber()
  @Min(1)
  @Max(5)
  status: number;

  @Column()
  @IsString()
  currency: string;

  @Column({ nullable: true })
  reasonReject: string;

  @Column({ name: 'is_main' })
  isMain: string;

  @ManyToOne(() => User, (user) => user?.travel_request)
  @JoinColumn({ name: 'is_main', referencedColumnName: 'userCode' })
  user: User;

  @OneToMany(
    () => TravelParticipant,
    (travelparticpant) => travelparticpant?.travel_requests,
  )
  travel_participants: TravelParticipant[];

  @Column({ nullable: true })
  parentId: number;

  @TreeParent()
  parent: TravelRequest;

  @TreeChildren()
  chilrens: TravelRequest[];

  @OneToMany(() => OtherCost, (otherCost) => otherCost?.travel_requests)
  otherCost: OtherCost[];

  @OneToMany(() => Journey, (journey) => journey.travel_request)
  journey: Journey[];

  @OneToMany(
    () => AirTicketPlan,
    (airTicketRequest) => airTicketRequest?.airTicketRequest,
  )
  airTicketPlan: AirTicketPlan[];

  @OneToMany(() => HotelPlan, (hotelRequest) => hotelRequest.travelRequest)
  hotelPlan: HotelPlan[];

  @OneToMany(() => TaxiPlan, (taxiRequest) => taxiRequest?.travelRequest)
  taxiPlan: TaxiPlan[];
}
