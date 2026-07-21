import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema()
export class HistoricalScore {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true, enum: ['listening', 'reading', 'writing', 'speaking', 'overall'] })
  category: string;

  @Prop({ required: true })
  referenceId: string; // ID of placement test or practice session
}

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  currentBandEstimate: number;

  @Prop({ required: true, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] })
  currentCefrEstimate: string;

  @Prop({ type: [HistoricalScore], default: [] })
  scoreHistory: HistoricalScore[];

  @Prop({ type: [String], default: [] })
  completedTasks: string[]; // List of task IDs from study plans

  @Prop({ type: [String], default: [] })
  masteredVocabulary: string[]; // Words studied successfully
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
ProgressSchema.index({ userId: 1 });
