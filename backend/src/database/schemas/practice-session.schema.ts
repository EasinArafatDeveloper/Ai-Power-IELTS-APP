import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PracticeSessionDocument = PracticeSession & Document;

@Schema()
export class FeedbackPoint {
  @Prop({ required: true, enum: ['grammar', 'vocabulary', 'structure'] })
  type: string;

  @Prop({ required: true })
  originalText: string;

  @Prop({ required: true })
  suggestedText: string;

  @Prop({ required: true })
  explanation: string;
}

@Schema()
export class SessionEvaluation {
  @Prop({ required: true })
  overallBand: number;

  @Prop({ type: MongooseSchema.Types.Map, of: Number, default: {} })
  scores: Record<string, number>; // taskAchievement, coherenceCohesion, lexicalResource, grammaticalRangeAccuracy

  @Prop({ type: [FeedbackPoint], default: [] })
  feedbackPoints: FeedbackPoint[];

  @Prop({ required: true })
  improvedVersion: string;

  @Prop({ required: true })
  generalComments: string;
}

@Schema({ timestamps: true })
export class PracticeSession {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['writing', 'speaking', 'reading', 'listening'] })
  moduleType: string;

  @Prop({ required: true, enum: ['writing_task_1', 'writing_task_2', 'reading_passage', 'speaking_part_1'] })
  taskType: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  userSubmission: string;

  @Prop({ default: 0 })
  wordCount: number;

  @Prop({ default: 0 })
  durationSeconds: number;

  @Prop({ type: SessionEvaluation, default: null })
  evaluation: SessionEvaluation;
}

export const PracticeSessionSchema = SchemaFactory.createForClass(PracticeSession);
PracticeSessionSchema.index({ userId: 1 });
PracticeSessionSchema.index({ userId: 1, moduleType: 1 });
