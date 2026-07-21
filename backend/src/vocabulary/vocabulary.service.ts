import { Injectable, OnModuleInit } from '@nestjs/common';
import { VocabularyRepository } from '../database/repositories/vocabulary.repository';
import { ProgressRepository } from '../database/repositories/progress.repository';
import { Vocabulary } from '../database/schemas/vocabulary.schema';
import { Types } from 'mongoose';

@Injectable()
export class VocabularyService implements OnModuleInit {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly progressRepository: ProgressRepository,
  ) {}

  async onModuleInit() {
    await this.seedVocabulary();
  }

  async getWords(): Promise<Vocabulary[]> {
    return this.vocabularyRepository.find({});
  }

  async markWordMastered(userId: string, word: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    let progress = await this.progressRepository.findOne({ userId: userObjectId });

    if (progress) {
      if (!progress.masteredVocabulary.includes(word)) {
        progress.masteredVocabulary.push(word);
        await progress.save();
      }
    }

    return { success: true, word };
  }

  private async seedVocabulary() {
    const count = await this.vocabularyRepository.find({});
    if (count.length > 0) return;

    const seedWords = [
      {
        word: 'Mitigate',
        partOfSpeech: 'verb',
        definition: 'Make something bad less severe, serious, or painful.',
        synonyms: ['alleviate', 'reduce', 'lessen', 'diminish'],
        examples: [
          { sentence: 'Drainage schemes have helped to mitigate the effects of floods.', translation: 'নিকাশী প্রকল্পগুলি বন্যার প্রভাব কমাতে সাহায্য করেছে।' },
        ],
        ieltsBandLevel: 7.5,
        category: 'Environment',
      },
      {
        word: 'Ubiquitous',
        partOfSpeech: 'adjective',
        definition: 'Present, appearing, or found everywhere.',
        synonyms: ['omnipresent', 'pervasive', 'universal'],
        examples: [
          { sentence: 'Mobile phones are now ubiquitous in modern society.', translation: 'মোবাইল ফোন এখন আধুনিক সমাজে সর্বব্যাপী।' },
        ],
        ieltsBandLevel: 8.0,
        category: 'Technology',
      },
      {
        word: 'Pragmatic',
        partOfSpeech: 'adjective',
        definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
        synonyms: ['practical', 'realistic', 'sensible'],
        examples: [
          { sentence: 'We need a pragmatic approach to solve this educational inequality.', translation: 'আমাদের এই শিক্ষাগত বৈষম্য দূর করতে একটি বাস্তবমুখী দৃষ্টিভঙ্গি প্রয়োজন।' },
        ],
        ieltsBandLevel: 7.0,
        category: 'Education',
      },
      {
        word: 'Substantiate',
        partOfSpeech: 'verb',
        definition: 'Provide evidence to support or prove the truth of.',
        synonyms: ['prove', 'support', 'validate', 'verify'],
        examples: [
          { sentence: 'The researcher was able to substantiate her claims with statistical figures.', translation: 'গবেষক পরিসংখ্যানগত পরিসংখ্যান দিয়ে তার দাবি প্রমাণ করতে পেরেছিলেন।' },
        ],
        ieltsBandLevel: 8.0,
        category: 'Science',
      },
      {
        word: 'Acquiesce',
        partOfSpeech: 'verb',
        definition: 'Accept something reluctantly but without protest.',
        synonyms: ['agree', 'comply', 'consent'],
        examples: [
          { sentence: 'He will eventually acquiesce to the new corporate guidelines.', translation: 'তিনি অবশেষে নতুন কর্পোরেট নির্দেশিকা মেনে নেবেন।' },
        ],
        ieltsBandLevel: 8.5,
        category: 'Business',
      }
    ];

    for (const w of seedWords) {
      await this.vocabularyRepository.create(w);
    }
  }
}
