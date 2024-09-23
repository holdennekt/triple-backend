import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DbModule } from '@app/db';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
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
      ],
    }),
    UserModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
