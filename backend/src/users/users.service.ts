import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { ProgressRepository } from '../database/repositories/progress.repository';
import { UserDocument } from '../database/schemas/user.schema';
import { OnboardingDto } from './dtos/onboarding.dto';
import { PlacementTestDto } from './dtos/placement-test.dto';
import { AIService } from '../ai/ai.service';
import { Types } from 'mongoose';

interface PlacementAIResponse {
  estimatedBand: number;
  cefrLevel: string;
  strengths: string[];
  weaknesses: string[];
  roadmap: string[];
}

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly aiService: AIService,
  ) {}

  async getUserMe(userId: string): Promise<UserDocument> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async completeOnboarding(userId: string, dto: OnboardingDto): Promise<UserDocument> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.targetBand = dto.targetBand;
    user.examDate = new Date(dto.examDate);
    user.onboardingCompleted = true;
    
    return user.save();
  }

  async completePlacementTest(userId: string, dto: PlacementTestDto): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare prompt for AI analysis
    const prompt = `
      You are an expert IELTS Examiner and Language Coach.
      Below is the student's placement assessment:
      - Grammar Answers (User choices): ${JSON.stringify(dto.grammarAnswers)}
      - Vocabulary Answers (User choices): ${JSON.stringify(dto.vocabularyAnswers)}
      - Reading Answers (User choices): ${JSON.stringify(dto.readingAnswers)}
      - Writing Essay response: "${dto.writingSubmission}"

      Evaluate their level based on grammar accuracy, vocabulary usage, reading comprehension answers, and writing structure.
      Generate:
      1. Overall estimated IELTS Band (e.g. 5.5, 6.0, 7.5 - values from 1.0 to 9.0 in increments of 0.5)
      2. CEFR Level (A1, A2, B1, B2, C1, or C2)
      3. List of strengths (3 points)
      4. List of weaknesses (3 points)
      5. Actionable study roadmap recommendations (3 core areas of focus)

      You must return ONLY a JSON response in the following format:
      {
        "estimatedBand": 6.0,
        "cefrLevel": "B2",
        "strengths": ["string"],
        "weaknesses": ["string"],
        "roadmap": ["string"]
      }
    `;

    const systemInstruction = 'You are a strict, objective IELTS Examiner. Return only raw structured JSON. Do not include markdown formatting or tags in your final output.';

    const evaluation = await this.aiService.generateJson<PlacementAIResponse>(prompt, systemInstruction);

    // Save placement progress to database
    let progress = await this.progressRepository.findOne({ userId: new Types.ObjectId(userId) });
    const scoreHistoryItem = {
      date: new Date(),
      score: evaluation.estimatedBand,
      category: 'overall',
      referenceId: 'placement-test',
    };

    if (!progress) {
      progress = await this.progressRepository.create({
        userId: new Types.ObjectId(userId),
        currentBandEstimate: evaluation.estimatedBand,
        currentCefrEstimate: evaluation.cefrLevel,
        scoreHistory: [scoreHistoryItem],
        completedTasks: [],
        masteredVocabulary: [],
      });
    } else {
      progress.currentBandEstimate = evaluation.estimatedBand;
      progress.currentCefrEstimate = evaluation.cefrLevel;
      progress.scoreHistory.push(scoreHistoryItem);
      await progress.save();
    }

    // Mark user assessment as complete
    user.assessmentCompleted = true;
    await user.save();

    return {
      evaluation,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        onboardingCompleted: user.onboardingCompleted,
        assessmentCompleted: user.assessmentCompleted,
      },
      progress,
    };
  }
}
