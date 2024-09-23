import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsIn,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { FindOptionsOrderValue } from 'typeorm';

export class GetPostsDto {
  @ApiPropertyOptional({ type: Number, example: 123 })
  @IsOptional()
  @IsInt()
  readonly userId?: number;

  @ApiPropertyOptional({ type: String, example: 'my title' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly title?: string;

  @ApiPropertyOptional({ type: String, example: 'interesting content' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly content?: string;

  @ApiPropertyOptional({ type: String, example: '2024-09-01' })
  @IsOptional()
  @IsDateString()
  readonly createdAtFrom?: string;

  @ApiPropertyOptional({ type: String, example: '2024-09-01' })
  @IsOptional()
  @IsDateString()
  readonly createdAtTo?: string;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiPropertyOptional({ type: Number, example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly limit: number = 10;

  @ApiPropertyOptional({ type: String, example: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly order: FindOptionsOrderValue = 'desc';

  @ApiPropertyOptional({
    type: String,
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'id'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'id'])
  readonly sortBy: string = 'createdAt';
}
