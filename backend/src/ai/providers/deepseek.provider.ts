import { Injectable, Logger } from '@nestjs/common';
import { AIProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class DeepSeekProvider implements AIProvider {
  private readonly logger = new Logger(DeepSeekProvider.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.deepseek.com/chat/completions';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey || this.apiKey.includes('your-key-here')) {
      this.logger.warn('DeepSeek API Key is missing. Returning simulated fallback response.');
      return this.getMockResponse(prompt);
    }

    try {
      const messages: Array<{ role: string; content: string }> = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      this.logger.error('DeepSeek API error:', error.message);
      return this.getMockResponse(prompt);
    }
  }

  async generateJson<T>(prompt: string, systemInstruction?: string): Promise<T> {
    if (!this.apiKey || this.apiKey.includes('your-key-here')) {
      this.logger.warn('DeepSeek API Key is missing. Returning simulated fallback JSON response.');
      return JSON.parse(this.getMockResponse(prompt, true)) as T;
    }

    try {
      const messages: Array<{ role: string; content: string }> = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: any = await response.json();
      const text = data.choices[0].message.content;
      return JSON.parse(text) as T;
    } catch (error: any) {
      this.logger.error('DeepSeek API JSON error:', error.message);
      return JSON.parse(this.getMockResponse(prompt, true)) as T;
    }
  }

  private getMockResponse(prompt: string, jsonMode = false): string {
    if (jsonMode) {
      if (prompt.includes('placement') || prompt.includes('CEFR') || prompt.includes('Placement')) {
        return JSON.stringify({
          estimatedBand: 6.0,
          cefrLevel: 'B2',
          strengths: ['Strong vocabulary range', 'Good basic grammar structure'],
          weaknesses: ['Frequent article errors', 'Difficulty in complex sentence structure', 'Lacks lexical depth in formal essay writing'],
          roadmap: [
            'Daily vocabulary workouts covering academic collocations',
            'Grammar intensive on relative clauses and complex sentence formations',
            'Weekly practice of IELTS Task 2 essays with core outline reviews',
          ],
        });
      }
      return JSON.stringify({
        overallBand: 6.5,
        scores: {
          taskAchievement: 6.5,
          coherenceCohesion: 6.0,
          lexicalResource: 7.0,
          grammaticalRangeAccuracy: 6.0,
        },
        feedbackPoints: [
          {
            type: 'grammar',
            originalText: 'The graph show the increase of population.',
            suggestedText: 'The graph shows the increase in population.',
            explanation: 'Subject-verb agreement requires "shows" for singular noun "graph", and the correct preposition is "in population".',
          },
          {
            type: 'vocabulary',
            originalText: 'It is a big change.',
            suggestedText: 'It represents a significant transformation.',
            explanation: 'Using more formal academic verbs and modifiers boosts Lexical Resource band score.',
          },
        ],
        improvedVersion: 'In contrast, the demographic indicators experienced a significant transformation, showing an increase in population...',
        generalComments: 'Your essay addresses the prompt adequately but suffers from grammatical inaccuracies and coherence issues. Focus on linking words and varied sentence structures.',
      });
    }

    return 'This is a simulated AI Coach text response. To enable live evaluations, plug in your API key in the backend .env configuration.';
  }
}
