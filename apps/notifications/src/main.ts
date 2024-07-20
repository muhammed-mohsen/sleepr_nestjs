import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const config = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport,
    options: {
      host: '0.0.0.0',
      port: config.get('PORT'),
    },
  });
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
}
bootstrap();
