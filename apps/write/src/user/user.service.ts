import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@app/entities/user/create-user.dto';
import { UserEntity } from '@app/entities/user/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from '@app/entities/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject('READ_SERVICE')
    private readonly readService: ClientProxy,
  ) {}

  async create(params: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(params.password, 10);
    return this.userRepository.save({
      ...params,
      password: hashedPassword,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    const newUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
      password: updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : user.password,
    });
    this.readService.emit('user_updated', newUser);
    return newUser;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    await this.userRepository.delete(id);
    this.readService.emit('user_deleted', user);
    return user;
  }
}
