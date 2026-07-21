import { Injectable, NotFoundException } from '@nestjs/common';
import { StudyPlanRepository } from '../database/repositories/study-plan.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { ProgressRepository } from '../database/repositories/progress.repository';
import { StudyPlan, StudyTask } from '../database/schemas/study-plan.schema';
import { Types } from 'mongoose';

@Injectable()
export class StudyPlanService {
  constructor(
    private readonly studyPlanRepository: StudyPlanRepository,
    private readonly userRepository: UserRepository,
    private readonly progressRepository: ProgressRepository,
  ) {}

  async getDailyTasks(userId: string): Promise<{ dayNumber: number; date: Date; tasks: StudyTask[] }> {
    const userObjectId = new Types.ObjectId(userId);
    let plan = await this.studyPlanRepository.findOne({ userId: userObjectId });

    if (!plan) {
      plan = await this.generateStudyPlan(userId) as any;
    }

    if (!plan || !plan.dailyTasks) {
      throw new NotFoundException('Failed to retrieve daily study tasks');
    }

    // Find the daily tasks corresponding to today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find day based on matching date or default to Day 1 if date mismatch (useful for dev/test environment)
    let dailyPlan = plan.dailyTasks.find(
      (dp) => new Date(dp.date).setHours(0, 0, 0, 0) === today.getTime(),
    );

    // Fallback: If no exact date match, return the first day that has pending tasks
    if (!dailyPlan) {
      dailyPlan = plan.dailyTasks.find((dp) => dp.tasks.some((t) => t.status === 'pending')) || plan.dailyTasks[0];
    }

    return {
      dayNumber: dailyPlan.dayNumber,
      date: dailyPlan.date,
      tasks: dailyPlan.tasks,
    };
  }

  async toggleTaskStatus(userId: string, taskId: string): Promise<StudyTask> {
    const userObjectId = new Types.ObjectId(userId);
    const plan = await this.studyPlanRepository.findOne({ userId: userObjectId });
    if (!plan) {
      throw new NotFoundException('Study plan not found');
    }

    let foundTask: StudyTask | null = null;
    let dayIndex = -1;
    let taskIndex = -1;

    for (let d = 0; d < plan.dailyTasks.length; d++) {
      const tIdx = plan.dailyTasks[d].tasks.findIndex((t) => t.id === taskId);
      if (tIdx > -1) {
        foundTask = plan.dailyTasks[d].tasks[tIdx];
        dayIndex = d;
        taskIndex = tIdx;
        break;
      }
    }

    if (!foundTask || dayIndex === -1 || taskIndex === -1) {
      throw new NotFoundException('Task not found in study plan');
    }

    const currentStatus = foundTask.status;
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    // Direct object update due to nested mongoose map/array schemas
    plan.dailyTasks[dayIndex].tasks[taskIndex].status = nextStatus;
    plan.markModified('dailyTasks');
    await plan.save();

    // Update historical progress
    let progress = await this.progressRepository.findOne({ userId: userObjectId });
    if (progress) {
      if (nextStatus === 'completed') {
        if (!progress.completedTasks.includes(taskId)) {
          progress.completedTasks.push(taskId);
        }
      } else {
        progress.completedTasks = progress.completedTasks.filter((id) => id !== taskId);
      }
      await progress.save();
    }

    // Update user streak if completing the first task of the day
    if (nextStatus === 'completed') {
      const user = await this.userRepository.findById(userId);
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastActiveDate = user.lastActive ? new Date(user.lastActive) : null;
        if (lastActiveDate) {
          lastActiveDate.setHours(0, 0, 0, 0);
          
          const timeDiff = today.getTime() - lastActiveDate.getTime();
          const dayDiff = timeDiff / (1000 * 3600 * 24);
          
          if (dayDiff === 1) {
            user.streakCount += 1;
          } else if (dayDiff > 1) {
            user.streakCount = 1;
          }
        } else {
          user.streakCount = 1;
        }
        user.lastActive = new Date();
        await user.save();
      }
    }

    return foundTask;
  }

  private async generateStudyPlan(userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = user.examDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysToExam = Math.max(7, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    // Generate study tasks programmatically for each day up to 30 days maximum for the MVP
    const planDays = Math.min(30, daysToExam);
    const dailyPlans = [];

    const categories = ['vocabulary', 'writing', 'reading', 'listening', 'speaking'] as const;

    for (let day = 1; day <= planDays; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (day - 1));

      // Day specific prompts / assignments
      const tasks: StudyTask[] = [
        {
          id: `task-vocab-d${day}`,
          title: `Master ${day * 5} Academic IELTS Vocabulary Words`,
          category: 'vocabulary',
          difficulty: day < 10 ? 'easy' : day < 20 ? 'medium' : 'hard',
          status: 'pending',
          estimatedMinutes: 15,
          metadata: { wordCount: 5, listId: `deck-${day}` },
        },
        {
          id: `task-writing-d${day}`,
          title: day % 2 === 0 
            ? 'Practice IELTS Writing Task 1: Academic Chart' 
            : 'Practice IELTS Writing Task 2: Academic Essay Outline',
          category: 'writing',
          difficulty: day < 15 ? 'easy' : 'medium',
          status: 'pending',
          estimatedMinutes: 40,
          metadata: { taskType: day % 2 === 0 ? 'writing_task_1' : 'writing_task_2' },
        },
        {
          id: `task-practice-d${day}`,
          title: day % 2 === 0
            ? 'Complete IELTS Section 1 Listening Drills'
            : 'Complete Reading Passage Comprehension Drill',
          category: day % 2 === 0 ? 'listening' : 'reading',
          difficulty: 'medium',
          status: 'pending',
          estimatedMinutes: 30,
          metadata: {},
        }
      ];

      dailyPlans.push({
        dayNumber: day,
        date,
        tasks,
      });
    }

    return this.studyPlanRepository.create({
      userId: userObjectId,
      startDate,
      endDate: dailyPlans[dailyPlans.length - 1].date,
      dailyTasks: dailyPlans,
    });
  }
}
