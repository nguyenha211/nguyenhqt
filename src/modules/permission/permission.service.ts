import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(input: CreatePermissionDto) {
    const { permissionCode } = input;
    const permision = await this.checkPermission(permissionCode);
    if (permision) {
      throw new HttpException('quyền đã tồn tại!', HttpStatus.BAD_REQUEST);
    }
    return this.permissionRepository.save(input);
  }

  async findAll() {
    return this.permissionRepository.find();
  }

  async edit(input: UpdatePermissionDto, permissionCode: string) {
    const { active, description, permissionName } = input;
    const permision = await this.checkPermission(permissionCode);
    if (!permision) {
      throw new HttpException('Quyền không tồn tại!', HttpStatus.BAD_REQUEST);
    }
    await this.permissionRepository.update(permissionCode, {
      active,
      description,
      permissionName,
    });
    return await this.permissionRepository.findOneBy({ permissionCode });
  }
  async changeAtive(isActive: boolean, permissionCode: string) {
    const permision = await this.checkPermission(permissionCode);
    if (!permision) {
      throw new HttpException('Quyền đã tồn tại!', HttpStatus.BAD_REQUEST);
    }
    await this.permissionRepository.update(permissionCode, {
      active: isActive,
    });
    return await this.permissionRepository.findOneBy({ permissionCode });
  }

  async remove(permissionCode: string) {
    const permision = await this.checkPermission(permissionCode);
    if (!permision) {
      throw new HttpException('Quyền không tồn tại!', HttpStatus.BAD_REQUEST);
    }
    this.permissionRepository.delete(permissionCode);
    return permision;
  }

  async checkPermission(permissionCode: string) {
    return await this.permissionRepository.findOneBy({ permissionCode });
  }
}
