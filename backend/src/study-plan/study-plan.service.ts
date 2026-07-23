import { Injectable, NotFoundException } from '@nestjs/common';
import { StudyPlanRepository } from '../database/repositories/study-plan.repository';
import { UserRepository } from '../database/repositories/user.repository';
import { ProgressRepository } from '../database/repositories/progress.repository';
import { StudyPlan, StudyTask } from '../database/schemas/study-plan.schema';
import { AIService } from '../ai/ai.service';
import { Types } from 'mongoose';

@Injectable()
export class StudyPlanService {
  constructor(
    private readonly studyPlanRepository: StudyPlanRepository,
    private readonly userRepository: UserRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly aiService: AIService,
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

  async generateStudyPlan(userId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete existing study plan if any to avoid duplicates
    await this.studyPlanRepository.delete({ userId: userObjectId });

    // Fetch diagnosed weaknesses from user progress
    const progress = await this.progressRepository.findOne({ userId: userObjectId });
    const baselineScore = progress?.currentBandEstimate || 6.0;
    const targetScore = user.targetBand || 7.5;
    const isWeakWriting = progress?.weakSkills?.some(s => /writing|cohes|essay|task 2/i.test(s)) || false;
    const isWeakGrammar = progress?.weakSkills?.some(s => /grammar|syntax|sentence/i.test(s)) || false;
    const isWeakVocab = progress?.weakSkills?.some(s => /vocab|lexic/i.test(s)) || false;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = user.examDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysToExam = Math.max(7, Math.ceil(timeDiff / (1000 * 3600 * 24)));

    // Generate study tasks programmatically for each day up to 30 days maximum for the MVP
    const planDays = Math.min(30, daysToExam);
    const dailyPlans = [];

    // Daily commit minutes (from 15 to 240, default 60)
    const dailyCommitMinutes = user.dailyStudyTime || 60;

    // Call AI to generate highly customized daily tasks for the first 7 days
    let aiDailyTasks: any[] = [];
    try {
      const prompt = `
        You are an expert AI IELTS Coach. A student needs a highly personalized study plan.
        Student Details:
        - Baseline Band: ${baselineScore} (${progress?.currentCefrEstimate || 'B2'})
        - Target Band: ${targetScore}
        - Strengths: ${JSON.stringify(progress?.strongSkills || [])}
        - Weaknesses: ${JSON.stringify(progress?.weakSkills || [])}
        - Prep Goal: "${user.studyGoal || 'General IELTS Improvement'}"
        - Daily Commited Time: ${dailyCommitMinutes} minutes
        
        Generate exactly 3 study tasks for each day from Day 1 to Day 7 (total 21 tasks).
        Ensure the tasks address their weaknesses: ${JSON.stringify(progress?.weakSkills || [])}.
        Each task must have an estimated duration in minutes. The sum of task durations on each day must equal ${dailyCommitMinutes} minutes.
        
        Return ONLY a JSON response in the following format:
        {
          "days": [
            {
              "dayNumber": number (1 to 7),
              "tasks": [
                {
                  "id": "string (unique task ID, e.g. task-vocab-d1)",
                  "title": "string (highly specific description of the task, e.g. 'Master 10 academic words about climate change')",
                  "category": "string (enum: 'reading', 'listening', 'writing', 'speaking', 'vocabulary')",
                  "difficulty": "string (enum: 'easy', 'medium', 'hard')",
                  "estimatedMinutes": number
                }
              ]
            }
          ]
        }
      `;

      const systemInstruction = 'You are a professional IELTS coach. Output raw JSON object matching the requested schema only. Do not wrap in markdown or any text.';
      const aiResponse = await this.aiService.generateJson<{ days: any[] }>(prompt, systemInstruction);
      if (aiResponse && aiResponse.days && Array.isArray(aiResponse.days)) {
        aiDailyTasks = aiResponse.days;
      }
    } catch (err) {
      console.warn('AI study plan generation failed, falling back to rule-based: ', err.message);
    }

    for (let day = 1; day <= planDays; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (day - 1));

      let tasks: StudyTask[] = [];

      // Check if we have AI-generated tasks for this day
      const aiDayData = aiDailyTasks.find(d => d.dayNumber === day);
      if (aiDayData && aiDayData.tasks && aiDayData.tasks.length > 0) {
        tasks = aiDayData.tasks.map((t: any) => ({
          id: t.id || `task-ai-d${day}-${Math.random().toString(36).substr(2, 4)}`,
          title: t.title,
          category: t.category || 'vocabulary',
          difficulty: t.difficulty || 'medium',
          status: 'pending',
          estimatedMinutes: t.estimatedMinutes || 20,
          metadata: t.metadata || {},
        }));
      } else {
        // Fallback: Programmatic custom tasks
        // Task 1: Vocabulary (Adjusted by weak skills)
        let vocabDuration = Math.round(dailyCommitMinutes * 0.25);
        if (isWeakVocab) vocabDuration = Math.round(dailyCommitMinutes * 0.35);
        vocabDuration = Math.max(10, Math.min(vocabDuration, 45));

        tasks.push({
          id: `task-vocab-d${day}`,
          title: isWeakVocab
            ? `Intensive Vocab: Focus on High-Yield Academic Collocations (Day ${day})`
            : `Expand IELTS Deck: 10 New Core Academic Vocabulary Words (Day ${day})`,
          category: 'vocabulary',
          difficulty: day < 10 ? 'easy' : day < 20 ? 'medium' : 'hard',
          status: 'pending',
          estimatedMinutes: vocabDuration,
          metadata: { wordCount: isWeakVocab ? 15 : 10, deckId: `deck-day-${day}` },
        });

        // Task 2: Writing / Grammar focus
        let writingDuration = Math.round(dailyCommitMinutes * 0.45);
        if (isWeakWriting || isWeakGrammar) writingDuration = Math.round(dailyCommitMinutes * 0.55);
        writingDuration = Math.max(15, Math.min(writingDuration, 90));

        let writingTitle = '';
        if (isWeakGrammar && day % 2 === 1) {
          writingTitle = `Grammar Drill: Constructing Complex & Compound Sentences for Band 7+ (Day ${day})`;
        } else if (isWeakWriting) {
          writingTitle = day % 2 === 0
            ? `Writing Coach: Academic Essay Intro & Body Outline (Day ${day})`
            : `Cohesion Challenge: Linking Devices and Essay Structuring (Day ${day})`;
        } else {
          writingTitle = day % 2 === 0
            ? `Writing Coach: Academic Writing Task 1 Data Report (Day ${day})`
            : `Writing Coach: Argumentative Essay Outline (Day ${day})`;
        }

        tasks.push({
          id: `task-writing-d${day}`,
          title: writingTitle,
          category: 'writing',
          difficulty: day < 12 ? 'easy' : day < 22 ? 'medium' : 'hard',
          status: 'pending',
          estimatedMinutes: writingDuration,
          metadata: { focus: isWeakGrammar ? 'grammar_accuracy' : 'coherence_cohesion' },
        });

        // Task 3: Core skills practice (Reading/Listening)
        const practiceDuration = Math.max(15, dailyCommitMinutes - vocabDuration - writingDuration);
        
        tasks.push({
          id: `task-practice-d${day}`,
          title: day % 2 === 0
            ? `Reading Passage: Academic Skimming & True/False/Not Given Drills (Day ${day})`
            : `Listening Section: Keyword Matching & Audio Comprehension Drill (Day ${day})`,
          category: day % 2 === 0 ? 'reading' : 'listening',
          difficulty: baselineScore >= 7.0 ? 'hard' : 'medium',
          status: 'pending',
          estimatedMinutes: practiceDuration,
          metadata: {},
        });
      }

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
