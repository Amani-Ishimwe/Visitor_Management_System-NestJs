import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';

@Module({
  imports:[DatabaseModule],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}
