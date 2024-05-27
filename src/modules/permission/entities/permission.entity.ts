import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('perission')
export class Permission {
  @PrimaryColumn({ unique: true, nullable: false })
  permissionCode: string;

  @Column({ nullable: false })
  @IsString()
  permissionName: string;

  @Column({ nullable: true })
  @IsString()
  description: string;

  @Column({ default: true })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @OneToMany(() => User, (user) => user.permission)
  users: User[];
}
