import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { IsNotEmpty, IsString } from 'class-validator';

export class MasterWordDto {
  @IsNotEmpty()
  @IsString()
  word: string;
}

@Controller('vocabulary')
@UseGuards(JwtAuthGuard)
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('words')
  async getWords() {
    return this.vocabularyService.getWords();
  }

  @Post('mastered')
  async markMastered(
    @CurrentUser() user: any,
    @Body() dto: MasterWordDto,
  ) {
    return this.vocabularyService.markWordMastered(user.userId, dto.word);
  }
}
