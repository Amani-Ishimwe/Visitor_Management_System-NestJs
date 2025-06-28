import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { DatabaseModule } from 'src/database/database.module';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';


@Module({
  imports:[DatabaseModule,EmailModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
