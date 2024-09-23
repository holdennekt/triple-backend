import { CreateUserDto } from '@app/entities/user/create-user.dto';
import { UserEntity } from '@app/entities/user/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { FindOptionsWhere } from 'typeorm';
import { UpdateUserDto } from '@app/entities/user/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('READ_SERVICE') private readonly readService: ClientProxy,
    @Inject('WRITE_SERVICE') private readonly writeService: ClientProxy,
  ) {}

  findAll(url?: string) {
    const message = new RmqRecordBuilder()
      .setOptions({ headers: { cacheKey: url?.split('?')[0] } })
      .build();
    return firstValueFrom<UserEntity[]>(
      this.readService.send('get_users', message),
    );
  }

  findOne(filter: Partial<UserEntity> | Partial<UserEntity>[], url?: string) {
    const message = new RmqRecordBuilder(filter)
      .setOptions({ headers: { cacheKey: url } })
      .build();
    return firstValueFrom<UserEntity>(
      this.readService.send('get_user', message),
    );
  }

  findOneFull(filter: Partial<UserEntity> | Partial<UserEntity>[]) {
    return firstValueFrom<UserEntity>(
      this.readService.send('get_user_full', filter),
    );
  }

  create(createUserDto: CreateUserDto) {
    return firstValueFrom<UserEntity>(
      this.writeService.send('create_user', createUserDto),
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return firstValueFrom<UserEntity>(
      this.writeService.send('update_user', { id, updateUserDto }),
    );
  }

  remove(id: number) {
    return firstValueFrom<UserEntity>(
      this.writeService.send('delete_user', id),
    );
  }
}
