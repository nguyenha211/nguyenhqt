import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateSubDepartmentDto } from './dto/create-sub-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiOperation({ summary: 'Khởi tạo phòng ban' })
  @Post('create')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      return this.departmentService.create(createDepartmentDto);
    } catch (err) {
      return err;
    }
  }
  @ApiOperation({ summary: 'Khởi tạo phòng ban con' })
  @Post(':parentDepartmentCode/create-sub')
  createSubDepartment(
    @Query('parentDepartmentCode') parentDepartmentCode: string,
    @Body() createSubDepartment: CreateSubDepartmentDto,
  ) {
    return this.departmentService.createSubDepartment(
      parentDepartmentCode,
      createSubDepartment,
    );
  }

  @ApiOperation({ summary: 'lấy cây bộ phận' })
  @Get('list')
  findDepartmentTree() {
    return this.departmentService.findDepartmentTree();
  }

  @Put('edit/:departmentCode')
  updateDepartmnt(
    @Query('departmentCode') departmentCode: string,
    @Body() input: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateDepartment(departmentCode, input);
  }
  @Delete('delete/:departmentCode')
  deleteDeparment(@Query('departmentCode') departmentCode: string) {
    return this.departmentService.deleteDepartment(departmentCode);
  }
}
