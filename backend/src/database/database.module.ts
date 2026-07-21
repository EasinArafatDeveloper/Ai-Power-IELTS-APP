import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from './schemas/user.schema';
import { StudyPlan, StudyPlanSchema } from './schemas/study-plan.schema';
import { PracticeSession, PracticeSessionSchema } from './schemas/practice-session.schema';
import { Vocabulary, VocabularySchema } from './schemas/vocabulary.schema';
import { Progress, ProgressSchema } from './schemas/progress.schema';

import { UserRepository } from './repositories/user.repository';
import { StudyPlanRepository } from './repositories/study-plan.repository';
import { PracticeSessionRepository } from './repositories/practice-session.repository';
import { VocabularyRepository } from './repositories/vocabulary.repository';
import { ProgressRepository } from './repositories/progress.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: StudyPlan.name, schema: StudyPlanSchema },
      { name: PracticeSession.name, schema: PracticeSessionSchema },
      { name: Vocabulary.name, schema: VocabularySchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
  ],
  providers: [
    UserRepository,
    StudyPlanRepository,
    PracticeSessionRepository,
    VocabularyRepository,
    ProgressRepository,
  ],
  exports: [
    MongooseModule,
    UserRepository,
    StudyPlanRepository,
    PracticeSessionRepository,
    VocabularyRepository,
    ProgressRepository,
  ],
})
export class DatabaseModule {}
