import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ type: Number, example: 123 })
  @IsInt()
  readonly userId: number;

  @ApiProperty({ type: String, example: 'my title' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ type: String, example: 'interesting content' })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
