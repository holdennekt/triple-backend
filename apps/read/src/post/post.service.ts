import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Between,
  FindOptionsWhere,
  LessThan,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
import { Cache } from 'cache-manager';
import { ClassTransformer } from 'class-transformer';
import { Validator } from 'class-validator';
import { PostEntity } from '@app/entities/post/post.entity';
import { GetPostsDto } from '@app/entities/post/get-all-posts.dto';
import { UserEntity } from '@app/entities/user/user.entity';

@Injectable()
export class PostService {
  readonly classTransformer = new ClassTransformer();
  readonly validator = new Validator();

  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll(getPostsDto: GetPostsDto) {
    const {
      userId,
      title,
      content,
      createdAtFrom,
      createdAtTo,
      page,
      limit,
      sortBy,
      order,
    } = getPostsDto;
    const posts = this.postRepository.find({
      where: {
        userId,
        title: title ? Like(`%${title}%`) : undefined,
        content: content ? Like(`%${content}%`) : undefined,
        createdAt:
          createdAtFrom && createdAtTo
            ? Between(createdAtFrom, createdAtTo)
            : createdAtFrom
              ? MoreThan(createdAtFrom)
              : createdAtTo
                ? LessThan(createdAtTo)
                : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: order },
    });

    return posts;
  }

  async findOne(filter: Partial<PostEntity> | Partial<PostEntity>[]) {
    const post = this.postRepository.findOne({ where: filter });
    if (!post) throw new NotFoundException();
    return post;
  }

  async handlePostEvent(post: PostEntity) {
    this.cacheManager.del('/post');
    this.cacheManager.del(`/post/${post.id}`);
    const keys = await this.cacheManager.store.keys('/post[^/]*');
    for (const key of keys) {
      const params = Object.fromEntries(
        key
          .split('?')[1]
          ?.split('&')
          ?.map((param) => param.split('='))
          ?.map(([key, val]) => [key, decodeURIComponent(val)]) ?? [],
      );
      const filterDto = this.classTransformer.plainToInstance(
        GetPostsDto,
        params,
        { enableImplicitConversion: true },
      );

      const isPostInScope = (post: PostEntity, filterDto: GetPostsDto) => {
        const maxDate = new Date(8640000000000000);
        const minDate = new Date(-8640000000000000);
        const addTimezoneOffset = (date: Date | string) => {
          const newDate = new Date(date);
          newDate.setMinutes(
            newDate.getMinutes() + newDate.getTimezoneOffset(),
          );
          return newDate;
        };
        const createdAtFrom =
          addTimezoneOffset(filterDto.createdAtFrom) ?? minDate;
        const createdAtTo = addTimezoneOffset(filterDto.createdAtTo) ?? maxDate;

        return (
          post.userId === filterDto.userId ||
          post.title.includes(filterDto.title) ||
          post.content.includes(filterDto.content) ||
          (new Date(post.createdAt) > createdAtFrom &&
            new Date(post.createdAt) < createdAtTo)
        );
      };

      if (isPostInScope(post, filterDto)) this.cacheManager.del(key);
    }
  }
}
