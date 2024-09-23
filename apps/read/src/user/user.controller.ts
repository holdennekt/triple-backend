import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { FindOptionsWhere } from 'typeorm';
import { UserEntity } from '@app/entities/user/user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get_users')
  async findAll() {
    return await this.userService.findAll();
  }

  @MessagePattern('get_user')
  async findOne(filter: Partial<UserEntity> | Partial<UserEntity>[]) {
    return await this.userService.findOne(filter);
  }

  @MessagePattern('get_user_full')
  async findOneFull(filter: Partial<UserEntity> | Partial<UserEntity>[]) {
    return await this.userService.findOneFull(filter);
  }

  @EventPattern('user_created')
  async handleUserCreated(data: UserEntity) {
    await this.userService.handleUserEvent(data);
  }

  @EventPattern('user_updated')
  async handleUserUpdated(data: UserEntity) {
    await this.userService.handleUserEvent(data);
  }

  @EventPattern('user_deleted')
  async handleUserDeleted(data: UserEntity) {
    await this.userService.handleUserEvent(data);
  }
}
