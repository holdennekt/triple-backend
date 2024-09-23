import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from '@app/entities/user/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from '@app/entities/user/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('create_user')
  create(dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @MessagePattern('update_user')
  update({ id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto }) {
    return this.userService.update(id, updateUserDto);
  }

  @MessagePattern('delete_user')
  remove(id: number) {
    return this.userService.remove(id);
  }
}
