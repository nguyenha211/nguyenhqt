import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { ILike, In, Repository } from 'typeorm';
import { Department } from '../department/entities/department.entity';
import { Permission } from '../permission/entities/permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createUserWithExistDepartment(input: CreateUserDto) {
    const {
      email,
      fullName,
      password,
      permissionCode,
      userCode,
      username,
      departmentCode,
    } = input;
    const department = await this.checkExistDepartment(departmentCode);
    const permission = await this.checkPermission(permissionCode);
    const user = await this.checkUser(userCode);
    if (user) {
      throw new HttpException('Người dùng đã tồn tại!', HttpStatus.BAD_REQUEST);
    }
    if (!department) {
      throw new HttpException('Phòng ban không tồn tại!', HttpStatus.NOT_FOUND);
    }
    if (!permission) {
      throw new HttpException('Quyền không tồn tại!', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.save({
      fullName,
      email,
      password,
      username,
      userCode,
      permissionCode,
      departmentCode: department?.departmentCode,
      departmentId: department?.id,
    });
  }

  async updateUser(input: UpdateUserDto, userCode: string) {
    const {
      departmentCode,
      email,
      fullName,
      password,
      permissionCode,
      username,
    } = input;
    const department = await this.checkExistDepartment(departmentCode);
    const permission = await this.checkPermission(permissionCode);
    const user = await this.checkUser(userCode);
    if (!user) {
      throw new HttpException('Người dùng đã tồn tại!', HttpStatus.BAD_REQUEST);
    }
    if (!department) {
      throw new HttpException('Phòng ban không tồn tại!', HttpStatus.NOT_FOUND);
    }
    if (!permission) {
      throw new HttpException('Quyền không tồn tại!', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(userCode, {
      departmentCode: department?.departmentCode,
      departmentId: department?.id,
      email,
      fullName,
      password,
      permissionCode,
      username,
    });
    return await this.checkUser(userCode);
  }

  async remove(userCode: string) {
    const user = await this.checkUser(userCode);
    if (!user) {
      throw new HttpException('Không tìm thấy user!', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(userCode);
    return await user;
  }

  async listUser(input: GetUserDto, pagination: PaginationDto) {
    const { departmentCode, permissionCode, searchText } = input;
    const { page, pageSize } = pagination;
    const query = [
      {
        fullName: ILike(`%${searchText || ''}%`),
        permission: {
          permissionCode: !_.isEmpty(permissionCode)
            ? In(permissionCode)
            : null,
        },
        department: {
          departmentCode: !_.isEmpty(departmentCode)
            ? In(departmentCode)
            : null,
        },
      },
      {
        email: ILike(`%${searchText || ''}%`),
        permission: {
          permissionCode: !_.isEmpty(permissionCode)
            ? In(permissionCode)
            : null,
        },
        department: {
          departmentCode: !_.isEmpty(departmentCode)
            ? In(departmentCode)
            : null,
        },
      },
      {
        userCode: ILike(`%${searchText || ''}%`),
        permission: {
          permissionCode: !_.isEmpty(permissionCode)
            ? In(permissionCode)
            : null,
        },
        department: {
          departmentCode: !_.isEmpty(departmentCode)
            ? In(departmentCode)
            : null,
        },
      },
    ];
    const [list, total] = await this.userRepository.findAndCount({
      select: {
        fullName: true,
        email: true,
        department: {
          id: true,
          departmentCode: true,
        },
        permission: {
          permissionCode: true,
          permissionName: true,
        },
        userCode: true,
      },
      where: query,
      relations: {
        department: true,
        permission: true,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const lastPage = Math.ceil(total / pageSize);
    const currentPage = +parseInt(page as any);
    const nextPage: number =
      currentPage + 1 > lastPage ? null : currentPage + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return await {
      list,
      pagination: {
        currentPage,
        totalElements: total,
        lastPage,
        nextPage,
        previousPage,
      },
    };
  }

  async checkExistDepartment(departmentCode: string) {
    return await this.departmentRepository.findOneBy({ departmentCode });
  }
  async checkPermission(permissionCode: string) {
    return await this.permissionRepository.findOneBy({ permissionCode });
  }
  async checkUser(userCode: string) {
    return await this.userRepository.findOneBy({ userCode });
  }
  async findByUsernameAndReturnPermission(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new HttpException(
        `không tìm thấy user có usernaem: ${username}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { permissionCode } = user;
    return permissionCode;
  }
}
