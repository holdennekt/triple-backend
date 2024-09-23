import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreatePostDto } from '@app/entities/post/create-post.dto';
import { UpdatePostDto } from '@app/entities/post/update-post.dto';
import { PostService } from './post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern('create_post')
  create(@Ctx() context: RmqContext, @Payload() createPostDto: CreatePostDto) {
    const {
      properties: { headers },
    } = context.getMessage();
    return this.postService.create(createPostDto, headers['actionBy']);
  }

  @MessagePattern('update_post')
  update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, updatePostDto }: { id: number; updatePostDto: UpdatePostDto },
  ) {
    const {
      properties: { headers },
    } = context.getMessage();
    return this.postService.update(id, updatePostDto, headers['actionBy']);
  }

  @MessagePattern('delete_post')
  remove(@Ctx() context: RmqContext, @Payload() id: number) {
    const {
      properties: { headers },
    } = context.getMessage();
    return this.postService.remove(id, headers['actionBy']);
  }
}
