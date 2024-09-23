import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { ACCESS_TOKEN_COOKIE_NAME } from './guards/auth.guard';
import { Public } from './public.decorator';

@Public()
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@ApiTooManyRequestsResponse()
@ApiInternalServerErrorResponse()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: SignInDto,
  ) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: SignInDto,
  ) {
    const token = await this.authService.signUp(
      signInDto.email,
      signInDto.password,
    );
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, token);
  }
}
