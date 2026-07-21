import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WritingService } from './writing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EvaluateWritingDto } from './dtos/evaluate-writing.dto';

@Controller('writing')
@UseGuards(JwtAuthGuard)
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @Get('prompts')
  async getPrompts() {
    return this.writingService.getPrompts();
  }

  @Post('evaluate')
  async evaluate(
    @CurrentUser() user: any,
    @Body() dto: EvaluateWritingDto,
  ) {
    return this.writingService.evaluateEssay(user.userId, dto);
  }
}
