import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VisitorsModule } from './visitors/visitors.module';
import { VisitModule } from './visit/visit.module';
import { DepartmentsModule } from './departments/departments.module';


@Module({
  imports: [ UsersModule, DatabaseModule, EmailModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
    CloudinaryModule,
    VisitorsModule,
    VisitModule,
    DepartmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
