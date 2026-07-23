import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AIModule } from '../ai/ai.module';
import { StudyPlanService } from './study-plan.service';
import { StudyPlanController } from './study-plan.controller';

@Module({
  imports: [DatabaseModule, AuthModule, AIModule],
  providers: [StudyPlanService],
  controllers: [StudyPlanController],
  exports: [StudyPlanService],
})
export class StudyPlanModule {}
