import { NOTIFICATIONS_PACKAGE_NAME } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const config = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: config.get('NOTIFICATIONS_GRPC_URL'),
      package: NOTIFICATIONS_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/./notifications.proto'),
    },
  });
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
}
bootstrap();
