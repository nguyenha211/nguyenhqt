import { OmitType } from '@nestjs/swagger';
import { Permission } from '../entities/permission.entity';

export class CreatePermissionDto extends OmitType(Permission, ['users']) {}
