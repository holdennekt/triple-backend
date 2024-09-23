import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { DbModule } from '@app/db';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { RmqCacheInterceptor } from './rmq-cache.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: parseInt(configService.get('REDIS_PORT')),
          },
        });
        return { store, ttl: 30 * 1000, max: 50 };
      },
    }),
    DbModule,
    UserModule,
    PostModule,
  ],
  controllers: [],
  providers: [RmqCacheInterceptor],
})
export class AppModule {}
