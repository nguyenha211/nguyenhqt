import { IsEmail, IsString } from 'class-validator';
import { Department } from 'src/modules/department/entities/department.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { TravelParticipant } from 'src/modules/travel-participants/entities/travel-participant.entity';
import { TravelRequest } from 'src/modules/travel-requests/entities/travel-request.entity';
import { IsPassword } from 'src/utils/is-password.constraint';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn()
  userCode: string;

  @Column({})
  username: string;

  @Column({})
  @IsString()
  @IsPassword({
    message:
      'Password must contain at least one uppercase letter, one special character, and be at least 8 characters long.',
  })
  password: string;

  @Column({ nullable: false })
  @IsString()
  fullName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ name: 'permission_code' })
  permissionCode: string;

  @ManyToOne(() => Permission, (permission) => permission.users)
  @JoinColumn({
    name: 'permission_code',
    referencedColumnName: 'permissionCode',
  })
  permission: Permission;

  @Column({ name: 'department_code' })
  departmentCode: string;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @ManyToOne(() => Department, (department) => department?.users)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  department: Department;

  @OneToMany(
    () => TravelParticipant,
    (travelParticipant) => travelParticipant?.users,
  )
  travel_participants: TravelParticipant[];

  @OneToMany(() => TravelRequest, (travelRequest) => travelRequest?.user)
  travel_request: TravelRequest[];
}
