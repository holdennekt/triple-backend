import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class SignInDto {
  @ApiProperty({ type: String, example: 'my-email@domain.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, example: 'my-password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
