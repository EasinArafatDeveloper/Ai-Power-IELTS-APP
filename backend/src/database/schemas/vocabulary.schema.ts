import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VocabularyDocument = Vocabulary & Document;

@Schema()
export class ExampleSentence {
  @Prop({ required: true })
  sentence: string;

  @Prop({ required: true })
  translation: string;
}

@Schema({ timestamps: true })
export class Vocabulary {
  @Prop({ required: true, unique: true, index: true })
  word: string;

  @Prop({ required: true })
  partOfSpeech: string; // noun, verb, adjective, etc.

  @Prop({ required: true })
  definition: string;

  @Prop({ type: [String], default: [] })
  synonyms: string[];

  @Prop({ type: [ExampleSentence], default: [] })
  examples: ExampleSentence[];

  @Prop({ required: true })
  ieltsBandLevel: number; // e.g., 6.0, 7.0, 8.0, 9.0

  @Prop({ required: true })
  category: string; // e.g., Environment, Education, Science
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
VocabularySchema.index({ word: 1 }, { unique: true });
VocabularySchema.index({ category: 1 });
