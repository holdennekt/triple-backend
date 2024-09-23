import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({ type: String, example: 'my-username' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ type: String, example: 'my-email@domain.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, example: 'my-password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
