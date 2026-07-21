import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { AIModule } from '../ai/ai.module';
import { WritingService } from './writing.service';
import { WritingController } from './writing.controller';

@Module({
  imports: [DatabaseModule, AuthModule, AIModule],
  providers: [WritingService],
  controllers: [WritingController],
  exports: [WritingService],
})
export class WritingModule {}
