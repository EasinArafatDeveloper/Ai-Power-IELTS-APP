import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [VocabularyService],
  controllers: [VocabularyController],
  exports: [VocabularyService],
})
export class VocabularyModule {}
