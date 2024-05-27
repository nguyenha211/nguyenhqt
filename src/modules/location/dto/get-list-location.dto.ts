import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/base/pagination-base.dto';

export class GetListLocationDto extends PaginationDto {
  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  searchText: string;

  @ApiProperty({
    example: 1,
    description: '1: trong nước, 2: nước ngoài',
    required: false,
  })
  @IsOptional()
  type: number;
}
