import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, RmqRecordBuilder } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PostEntity } from '@app/entities/post/post.entity';
import { GetPostsDto } from '@app/entities/post/get-all-posts.dto';
import { CreatePostDto } from '@app/entities/post/create-post.dto';
import { UserEntity } from '@app/entities/user/user.entity';
import { FindOptionsWhere } from 'typeorm';
import { UpdatePostDto } from '@app/entities/post/update-post.dto';
import { JwtTokenPayload } from '../auth/auth.service';

@Injectable()
export class PostService {
  constructor(
    @Inject('READ_SERVICE') private readonly readService: ClientRMQ,
    @Inject('WRITE_SERVICE') private readonly writeService: ClientRMQ,
  ) {}

  findAll(query: GetPostsDto, url?: string) {
    const message = new RmqRecordBuilder(query)
      .setOptions({ headers: { cacheKey: url } })
      .build();
    return firstValueFrom<PostEntity[]>(
      this.readService.send('get_posts', message),
    );
  }

  findOne(
    filter: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
    url?: string,
  ) {
    const message = new RmqRecordBuilder(filter)
      .setOptions({ headers: { cacheKey: url } })
      .build();
    return firstValueFrom<PostEntity>(
      this.readService.send('get_post', message),
    );
  }

  create(createPostDto: CreatePostDto, user: JwtTokenPayload) {
    const message = new RmqRecordBuilder(createPostDto)
      .setOptions({ headers: { actionBy: user.userId.toString() } })
      .build();
    return firstValueFrom<PostEntity>(
      this.writeService.send('create_post', message),
    );
  }

  update(id: number, updatePostDto: UpdatePostDto, user: JwtTokenPayload) {
    const message = new RmqRecordBuilder({ id, updatePostDto })
      .setOptions({ headers: { actionBy: user.userId.toString() } })
      .build();
    return firstValueFrom<PostEntity>(
      this.writeService.send('update_post', message),
    );
  }

  remove(id: number, user: JwtTokenPayload) {
    const message = new RmqRecordBuilder(id)
      .setOptions({ headers: { actionBy: user.userId.toString() } })
      .build();
    return firstValueFrom<PostEntity>(
      this.writeService.send('delete_post', message),
    );
  }
}
