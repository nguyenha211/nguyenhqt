import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateSubDepartmentDto } from './dto/create-sub-department.dto';
import { Department } from './entities/department.entity';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { departmentCode } = createDepartmentDto;
    const checkExistDepartment = await this.departmentRepository.findOne({
      where: { departmentCode },
    });
    if (checkExistDepartment) {
      throw new HttpException('Phòng ban đã tồn tại', HttpStatus.BAD_REQUEST);
    }
    return await this.departmentRepository.save({ departmentCode });
  }

  async createSubDepartment(
    parentDepartmentCode: string,
    createSubDepartment: CreateSubDepartmentDto,
  ) {
    const parentDepartment = await this.departmentRepository.findOne({
      where: { departmentCode: parentDepartmentCode },
    });
    if (!parentDepartment) {
      throw new HttpException(
        'Không tìm thấy phòng ban!',
        HttpStatus.NOT_FOUND,
      );
    }
    const { departmentCode } = createSubDepartment;
    const subDepartment = new Department();
    subDepartment.departmentCode = departmentCode;
    subDepartment.parent = parentDepartment;
    subDepartment.parentId = parentDepartment?.id;
    return this.departmentRepository.save(subDepartment);
  }

  async findDepartmentTree() {
    const data = await this.findDepartmentsWithChildren(null);
    return { data };
  }

  private async findDepartmentsWithChildren(
    parentId: number | null,
  ): Promise<Department[]> {
    let query: any = { parent: IsNull() }; // Chỉ lấy các phòng ban cha
    if (parentId !== null) {
      query = { parent: { id: parentId } }; // Lấy các phòng ban con của một phòng ban cha cụ thể
    }

    const departments = await this.departmentRepository.find({
      select: { id: true, departmentCode: true },
      where: query,
      relations: ['childrens'], // Load cả childrens nếu có
    });

    // Lặp qua từng phòng ban và gọi đệ quy để lấy childrens của từng phòng ban cha
    for (const department of departments) {
      if (!department.childrens || department.childrens.length === 0) {
        continue; // Nếu không có children, tiếp tục với phòng ban tiếp theo
      }
      department.childrens = await this.findDepartmentsWithChildren(
        department.id,
      );
    }
    return departments;
  }

  async updateDepartment(departmentCode: string, input: UpdateDepartmentDto) {
    const { departmentCode: departmentCodeInBody } = input;
    const checkExistDepartment = await this.departmentRepository.findOne({
      where: { departmentCode },
    });
    if (!checkExistDepartment) {
      throw new HttpException('Không tìm thấy phòng ban', HttpStatus.NOT_FOUND);
    }
    const { id } = checkExistDepartment;
    await this.departmentRepository.update(id, {
      departmentCode: departmentCodeInBody,
    });
    return this.departmentRepository.findOne({ where: { id } });
  }

  async deleteDepartment(departmentCode: string) {
    const checkExistDepartment = await this.departmentRepository.findOne({
      where: { departmentCode },
    });
    if (!checkExistDepartment) {
      throw new HttpException('Không tìm thấy phòng ban', HttpStatus.NOT_FOUND);
    }
    await this.departmentRepository.remove(checkExistDepartment);
    return checkExistDepartment;
  }
}
