import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '@app/entities/post/create-post.dto';
import { PostEntity } from '@app/entities/post/post.entity';
import { ClientProxy } from '@nestjs/microservices';
import { UpdatePostDto } from '@app/entities/post/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @Inject('READ_SERVICE')
    private readonly readService: ClientProxy,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    if (createPostDto.userId !== parseInt(userId))
      throw new ForbiddenException();
    const { id } = await this.postRepository.save(createPostDto);
    const post = await this.postRepository.findOne({ where: { id } });
    this.readService.emit('post_created', post);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException();
    if (post.userId !== parseInt(userId)) throw new ForbiddenException();
    await this.postRepository.update(id, updatePostDto);
    const newPost = await this.postRepository.findOne({ where: { id } });
    this.readService.emit('post_updated', newPost);
    return newPost;
  }

  async remove(id: number, userId: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException();
    if (post.userId !== parseInt(userId)) throw new ForbiddenException();
    await this.postRepository.delete(id);
    this.readService.emit('post_deleted', post);
    return post;
  }
}
