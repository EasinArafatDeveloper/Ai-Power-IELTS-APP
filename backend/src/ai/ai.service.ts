import { Injectable, Logger } from '@nestjs/common';
import { AIProvider } from './interfaces/ai-provider.interface';
import { DeepSeekProvider } from './providers/deepseek.provider';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private provider: AIProvider;

  constructor(private readonly deepSeekProvider: DeepSeekProvider) {
    const providerName = process.env.AI_PROVIDER || 'deepseek';
    this.logger.log(`Initializing AI Service with provider: ${providerName}`);
    
    if (providerName === 'deepseek') {
      this.provider = this.deepSeekProvider;
    } else {
      this.provider = this.deepSeekProvider;
    }
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    return this.provider.generateText(prompt, systemInstruction);
  }

  async generateJson<T>(prompt: string, systemInstruction?: string): Promise<T> {
    return this.provider.generateJson<T>(prompt, systemInstruction);
  }
}
