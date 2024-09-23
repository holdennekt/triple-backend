import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserEntity } from '@app/entities/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(filter: Partial<UserEntity> | Partial<UserEntity>[]) {
    const user = await this.userRepository.findOne({ where: filter });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findOneFull(filter: Partial<UserEntity> | Partial<UserEntity>[]) {
    const user = await this.userRepository.findOne({
      where: filter,
      select: ['id', 'name', 'email', 'password', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async handleUserEvent(user: UserEntity) {
    this.cacheManager.del('/user');
    this.cacheManager.del(`/user/${user.id}`);
  }
}
