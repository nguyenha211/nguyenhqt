import { IsString, Length } from 'class-validator';
import { BaseEntity } from 'src/common/base/create-update-base.dto';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('department')
@Tree('nested-set')
export class Department extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  @IsString()
  @Length(1, 20, { message: 'Tên phòng ban không được quá 20 ký tự' })
  departmentCode: string;

  @Column({ nullable: true })
  parentId: number;

  @TreeParent()
  parent: Department;

  @TreeChildren()
  childrens: Department[];

  @OneToMany(() => User, (user) => user?.department)
  users: User[];
}
