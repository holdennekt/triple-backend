import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PostEntity } from '@app/entities/post/post.entity';
import { GetPostsDto } from '@app/entities/post/get-all-posts.dto';
import { CreatePostDto } from '@app/entities/post/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from '@app/entities/post/update-post.dto';
import { WsGateway } from '../ws/ws.gateway';

@Controller('post')
@ApiUnauthorizedResponse()
@ApiInternalServerErrorResponse()
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly wsGateway: WsGateway,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Got posts',
    type: PostEntity,
    isArray: true,
  })
  @ApiBadRequestResponse()
  findAll(@Req() req: Request, @Query() query: GetPostsDto) {
    return this.postService.findAll(query, req.url);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Got post', type: PostEntity })
  @ApiNotFoundResponse()
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.postService.findOne({ id: parseInt(id) }, req.url);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Post created', type: PostEntity })
  @ApiBadRequestResponse()
  async create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    const post = await this.postService.create(createPostDto, req['user']);
    this.wsGateway.broadcast('post_created', post);
    return post;
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Updated post', type: PostEntity })
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postService.update(
      parseInt(id),
      updatePostDto,
      req['user'],
    );
    this.wsGateway.broadcast('post_updated', post);
    return post;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Deleted post', type: PostEntity })
  @ApiNotFoundResponse()
  async remove(@Req() req: Request, @Param('id') id: string) {
    const post = await this.postService.remove(parseInt(id), req['user']);
    this.wsGateway.broadcast('post_deleted', post);
    return post;
  }
}
