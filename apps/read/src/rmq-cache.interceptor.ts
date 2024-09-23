import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { Observable, of, tap } from 'rxjs';

/**
 * Interceptor for rabbitmq microservice that caches all "get*" messages by "cacheKey" header
 */
export class RmqCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const rmqContext = context.switchToRpc().getContext<RmqContext>();
    if (!rmqContext.getPattern().startsWith('get')) return next.handle();
    const headers = rmqContext.getMessage().properties.headers;
    const key = headers['cacheKey'];
    if (key) {
      const value = await this.cacheManager.get(key);
      if (value) return of(value);
    }
    return next.handle().pipe(
      tap(async (res: Response) => {
        if (key) this.cacheManager.set(key, res);
      }),
    );
  }
}
