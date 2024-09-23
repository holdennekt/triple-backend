import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { WsAdapter } from '@nestjs/platform-ws';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from './app.module';
import { ACCESS_TOKEN_COOKIE_NAME, AuthGuard } from './auth/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny'));
  app.use(cookieParser());

  const throttlerGuard = app.get(ThrottlerGuard);
  const authGuard = app.get(AuthGuard);
  app.useGlobalGuards(throttlerGuard, authGuard);

  app.useWebSocketAdapter(new WsAdapter(app));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Triple backend')
    .setVersion('1')
    .addCookieAuth(ACCESS_TOKEN_COOKIE_NAME)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
