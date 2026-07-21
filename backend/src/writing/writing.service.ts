import { Injectable, NotFoundException } from '@nestjs/common';
import { PracticeSessionRepository } from '../database/repositories/practice-session.repository';
import { ProgressRepository } from '../database/repositories/progress.repository';
import { AIService } from '../ai/ai.service';
import { EvaluateWritingDto } from './dtos/evaluate-writing.dto';
import { Types } from 'mongoose';

interface WritingAIResponse {
  overallBand: number;
  scores: {
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRangeAccuracy: number;
  };
  feedbackPoints: Array<{
    type: 'grammar' | 'vocabulary' | 'structure';
    originalText: string;
    suggestedText: string;
    explanation: string;
  }>;
  improvedVersion: string;
  generalComments: string;
}

@Injectable()
export class WritingService {
  constructor(
    private readonly practiceSessionRepository: PracticeSessionRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly aiService: AIService,
  ) {}

  // List of preloaded prompts for practice
  async getPrompts() {
    return [
      {
        id: 'w-p1',
        title: 'IELTS Academic Writing Task 1: Population Growth',
        type: 'writing_task_1',
        promptText: 'The chart below shows the changes in the percentage of population living in urban areas in three different countries (A, B, and C) between 1990 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        estimatedMinutes: 20,
        wordTarget: 'Minimum 150 words',
      },
      {
        id: 'w-p2',
        title: 'IELTS Academic Writing Task 2: Technology in Education',
        type: 'writing_task_2',
        promptText: 'Some people think that tablets and laptops should replace books in schools, while others believe that printed books are still essential for learning. Discuss both views and give your own opinion. Write at least 250 words.',
        estimatedMinutes: 40,
        wordTarget: 'Minimum 250 words',
      },
    ];
  }

  async evaluateEssay(userId: string, dto: EvaluateWritingDto): Promise<any> {
    const wordCount = dto.submission.trim().split(/\s+/).filter(Boolean).length;

    // AI evaluation prompt
    const prompt = `
      You are an expert IELTS Writing Examiner. Evaluate the following IELTS writing submission based on the official grading criteria.

      IELTS Essay Details:
      - Prompt: "${dto.prompt}"
      - Task Type: "${dto.taskType === 'writing_task_1' ? 'Task 1 (Academic Summarization)' : 'Task 2 (Academic Essay)'}"
      - Student Submission: "${dto.submission}"
      - Word Count: ${wordCount} words

      Grade each of the 4 IELTS criteria (scores from 1.0 to 9.0 in increments of 0.5):
      1. Task Achievement (for Task 1) / Task Response (for Task 2)
      2. Coherence and Cohesion
      3. Lexical Resource
      4. Grammatical Range and Accuracy
      
      Calculate the Overall Band (average of the 4 scores, rounded to the nearest half band, e.g. 6.0, 6.5, 7.0).

      Identify up to 3 sentence-level corrections for errors in grammar, vocabulary, or coherence. Include:
      - type: 'grammar', 'vocabulary', or 'structure'
      - originalText: the exact incorrect substring
      - suggestedText: the corrected or higher-band replacement
      - explanation: brief tip

      Provide a rewritten high-band (Band 8.5+) model version of the essay.
      Provide concise general feedback and summary of suggestions.

      Return ONLY a JSON response in the following format:
      {
        "overallBand": 6.5,
        "scores": {
          "taskAchievement": 6.5,
          "coherenceCohesion": 6.0,
          "lexicalResource": 7.0,
          "grammaticalRangeAccuracy": 6.0
        },
        "feedbackPoints": [
          {
            "type": "grammar",
            "originalText": "exact incorrect string",
            "suggestedText": "suggested correction string",
            "explanation": "brief explanation"
          }
        ],
        "improvedVersion": "complete high band rewritten essay",
        "generalComments": "overall tips for student"
      }
    `;

    const systemInstruction = 'You are an objective IELTS Writing Examiner. Evaluate submissions strictly. Return only raw JSON matching the schema. No markdown formatting.';

    const evaluation = await this.aiService.generateJson<WritingAIResponse>(prompt, systemInstruction);

    // Save session in database
    const session = await this.practiceSessionRepository.create({
      userId: new Types.ObjectId(userId),
      moduleType: 'writing',
      taskType: dto.taskType,
      prompt: dto.prompt,
      userSubmission: dto.submission,
      wordCount,
      durationSeconds: dto.durationSeconds,
      evaluation: {
        overallBand: evaluation.overallBand,
        scores: evaluation.scores,
        feedbackPoints: evaluation.feedbackPoints,
        improvedVersion: evaluation.improvedVersion,
        generalComments: evaluation.generalComments,
      },
    });

    // Update Progress scorecard with new score
    let progress = await this.progressRepository.findOne({ userId: new Types.ObjectId(userId) });
    if (progress) {
      const scoreHistoryItem = {
        date: new Date(),
        score: evaluation.overallBand,
        category: 'writing',
        referenceId: session._id.toString(),
      };
      progress.scoreHistory.push(scoreHistoryItem);
      // Re-estimate overall band
      const writingScores = progress.scoreHistory
        .filter((sh) => sh.category === 'writing')
        .map((sh) => sh.score);
      const avgWriting = writingScores.reduce((sum, s) => sum + s, 0) / writingScores.length;
      
      progress.currentBandEstimate = Math.round((avgWriting + progress.currentBandEstimate) / 2 * 2) / 2; // Simple running average helper
      await progress.save();
    }

    return session;
  }
}
