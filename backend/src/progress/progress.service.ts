import { Injectable } from '@nestjs/common';
import { ProgressRepository } from '../database/repositories/progress.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { Types } from 'mongoose';

@Injectable()
export class ProgressService {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getProgressStats(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userRepository.findById(userId);
    let progress = await this.progressRepository.findOne({ userId: userObjectId });

    if (!progress) {
      progress = await this.progressRepository.create({
        userId: userObjectId,
        currentBandEstimate: 6.0,
        currentCefrEstimate: 'B2',
        scoreHistory: [
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), score: 5.5, category: 'overall', referenceId: 'onboarding' }
        ],
        completedTasks: [],
        masteredVocabulary: [],
      });
    }

    return {
      currentBand: progress.currentBandEstimate,
      targetBand: user?.targetBand || 7.0,
      cefrLevel: progress.currentCefrEstimate,
      streakCount: user?.streakCount || 1,
      examDate: user?.examDate || null,
      masteredVocabCount: progress.masteredVocabulary.length,
      completedTasksCount: progress.completedTasks.length,
      scoreHistory: progress.scoreHistory,
    };
  }
}
