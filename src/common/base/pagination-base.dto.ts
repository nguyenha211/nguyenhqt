import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
export class PaginationDto {
  @ApiProperty({ description: 'Trang hiện tại', example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => value || 1)
  page: number;

  @ApiProperty({
    description: 'Số lượng dữ liệu trên 1 trang',
    example: 10,
    required: false,
  })
  @Transform(({ value }) => value || 10)
  @IsOptional()
  pageSize: number;
}
