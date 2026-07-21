import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { DeepSeekProvider } from './providers/deepseek.provider';

@Module({
  providers: [DeepSeekProvider, AIService],
  exports: [AIService],
})
export class AIModule {}
