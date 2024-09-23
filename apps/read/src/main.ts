import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ConfigService } from '@nestjs/config';
import { ExceptionsFilter } from '@app/common/exeptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RmqCacheInterceptor } from './rmq-cache.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(app.get(RmqCacheInterceptor));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new ExceptionsFilter());

  const configService = app.get(ConfigService);
  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get('RABBIT_MQ_URL')],
        queue: configService.get('RABBIT_MQ_QUEUE'),
        queueOptions: {
          durable: false,
        },
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.init();
}
bootstrap();
