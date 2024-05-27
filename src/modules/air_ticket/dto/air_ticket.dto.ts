import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class AirTicketDto {
  @ApiProperty({ example: '', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'searchText không được quá 255 ký tự' })
  searchText: string;

  @ApiProperty({
    example: [1],
    description: '1 trong nước 2 nước ngoài',
    required: false,
  })
  @IsOptional()
  type: number[];

  @ApiProperty({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
