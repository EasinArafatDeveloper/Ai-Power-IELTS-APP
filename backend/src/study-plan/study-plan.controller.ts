import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { StudyPlanService } from './study-plan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('study-plan')
@UseGuards(JwtAuthGuard)
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Get('daily')
  async getDailyTasks(@CurrentUser() user: any) {
    return this.studyPlanService.getDailyTasks(user.userId);
  }

  @Patch('task/:taskId/toggle')
  async toggleTask(
    @CurrentUser() user: any,
    @Param('taskId') taskId: string,
  ) {
    return this.studyPlanService.toggleTaskStatus(user.userId, taskId);
  }
}
