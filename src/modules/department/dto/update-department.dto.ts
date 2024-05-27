import { PickType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends PickType(CreateDepartmentDto, [
  'departmentCode',
]) {}
