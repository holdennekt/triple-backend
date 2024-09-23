import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '@app/entities/user/create-user.dto';
import { UserEntity } from '@app/entities/user/user.entity';
import { UpdateUserDto } from '@app/entities/user/update-user.dto';
import { Request } from 'express';
import { UserService } from './user.service';
import { CanSelfGuard } from '../auth/guards/can-self.guard';
import { Public } from '../auth/public.decorator';
import { WsGateway } from '../ws/ws.gateway';

@Controller('user')
@ApiUnauthorizedResponse()
@ApiInternalServerErrorResponse()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly wsGateway: WsGateway,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Got users',
    type: UserEntity,
    isArray: true,
  })
  findAll(@Req() req: Request) {
    return this.userService.findAll(req.url);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Got user', type: UserEntity })
  @ApiNotFoundResponse()
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.userService.findOne({ id: parseInt(id) }, req.url);
  }

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User created', type: UserEntity })
  @ApiBadRequestResponse()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    this.wsGateway.broadcast('user_created', user);
    return user;
  }

  @UseGuards(CanSelfGuard.bind(null, (req: Request) => req.params['id']))
  @Patch(':id')
  @ApiOkResponse({ description: 'Updated user', type: UserEntity })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(parseInt(id), updateUserDto);
    this.wsGateway.broadcast('user_updated', user);
    return user;
  }

  @UseGuards(CanSelfGuard.bind(null, (req: Request) => req.params['id']))
  @Delete(':id')
  @ApiOkResponse({ description: 'Deleted user', type: UserEntity })
  @ApiNotFoundResponse()
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(parseInt(id));
    this.wsGateway.broadcast('user_deleted', user);
    return user;
  }
}
