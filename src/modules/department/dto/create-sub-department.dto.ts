import { PickType } from '@nestjs/swagger';
import { CreateDepartmentDto } from './create-department.dto';

export class CreateSubDepartmentDto extends PickType(CreateDepartmentDto, [
  'departmentCode',
]) {}
