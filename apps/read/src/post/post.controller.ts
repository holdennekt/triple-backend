import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { FindOptionsWhere } from 'typeorm';
import { GetPostsDto } from '@app/entities/post/get-all-posts.dto';
import { UserEntity } from '@app/entities/user/user.entity';
import { PostEntity } from '@app/entities/post/post.entity';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern('get_posts')
  async findAll(getPostsDto: GetPostsDto) {
    return await this.postService.findAll(getPostsDto);
  }

  @MessagePattern('get_post')
  async findOne(filter: Partial<PostEntity> | Partial<PostEntity>[]) {
    return await this.postService.findOne(filter);
  }

  @EventPattern('post_created')
  async handlePostCreated(data: PostEntity) {
    await this.postService.handlePostEvent(data);
  }

  @EventPattern('post_updated')
  async handlePostUpdated(@Payload() data: PostEntity) {
    await this.postService.handlePostEvent(data);
  }

  @EventPattern('post_deleted')
  async handlePostDeleted(data: PostEntity) {
    await this.postService.handlePostEvent(data);
  }
}
