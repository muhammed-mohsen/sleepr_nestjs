import { UserDocument, UserSchema } from '@app/common';
import { DatabaseModule } from '@app/common/database';
import { LoggerModule } from '@app/common/logger';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
  ],

  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
