import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AIModule } from './ai/ai.module';
import { UsersModule } from './users/users.module';
import { StudyPlanModule } from './study-plan/study-plan.module';
import { WritingModule } from './writing/writing.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { ProgressModule } from './progress/progress.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AIModule,
    UsersModule,
    StudyPlanModule,
    WritingModule,
    VocabularyModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
