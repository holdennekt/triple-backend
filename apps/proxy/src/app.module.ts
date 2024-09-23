import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { WsModule } from './ws/ws.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: seconds(configService.get('THROTTLE_TTL_SEC')),
            limit: configService.get('THROTTLE_LIMIT'),
          },
        ],
      }),
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: 'READ_SERVICE',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RABBIT_MQ_URL')],
              queue: configService.get('RABBIT_MQ_READ_QUEUE'),
              queueOptions: { durable: false },
            },
          }),
        },
        {
          name: 'WRITE_SERVICE',
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RABBIT_MQ_URL')],
              queue: configService.get('RABBIT_MQ_WRITE_QUEUE'),
              queueOptions: { durable: false },
            },
          }),
        },
      ],
    }),
    AuthModule,
    UserModule,
    PostModule,
    WsModule,
  ],
  controllers: [],
  providers: [ThrottlerGuard],
})
export class AppModule {}
