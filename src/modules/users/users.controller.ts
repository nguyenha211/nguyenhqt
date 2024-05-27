import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/base/pagination-base.dto';
import { GetUserDto } from './dto/get-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Khởi tạo user' })
  @Post('create')
  create(@Body() input: CreateUserDto) {
    return this.usersService.createUserWithExistDepartment(input);
  }
  @ApiOperation({ summary: 'chỉnh sửa' })
  @Put('/update/:userCode')
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userCode') userCode: string,
  ) {
    return this.usersService.updateUser(updateUserDto, userCode);
  }

  @Delete(':userCode/delete')
  delete(@Param('userCode') userCode: string) {
    return this.usersService.remove(userCode);
  }

  @Post('list')
  getList(@Query() pagination: PaginationDto, @Body() input: GetUserDto) {
    return this.usersService.listUser(input, pagination);
  }
}
