import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'khởi tạo quyền' })
  @Post('create')
  create(@Body() input: CreatePermissionDto) {
    return this.permissionService.create(input);
  }
  @ApiOperation({ summary: 'đổi trạng thái' })
  @Put('change-active/:permissionCode')
  changeActive(
    @Body() isActive: boolean,
    @Query('permissionCode') permissionCode: string,
  ) {
    return this.permissionService.changeAtive(isActive, permissionCode);
  }
  @ApiOperation({ summary: 'sửa quyền' })
  @Put(':permissionCode/update')
  update(
    @Query('permissionCode') permissionCode: string,
    @Body() input: UpdatePermissionDto,
  ) {
    return this.permissionService.edit(input, permissionCode);
  }
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }
  @Delete(':permissionCode/delete')
  delete(@Param('permissionCode') permissionCode: string) {
    return this.permissionService.remove(permissionCode);
  }
}
