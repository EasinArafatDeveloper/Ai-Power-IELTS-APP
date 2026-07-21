import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type StudyPlanDocument = StudyPlan & Document;

@Schema()
export class StudyTask {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['reading', 'listening', 'writing', 'speaking', 'vocabulary'] })
  category: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficulty: string;

  @Prop({ required: true, enum: ['pending', 'completed'], default: 'pending' })
  status: string;

  @Prop({ required: true })
  estimatedMinutes: number;

  @Prop({ type: MongooseSchema.Types.Map, of: MongooseSchema.Types.Mixed, default: {} })
  metadata: Record<string, any>;
}

@Schema()
export class DailyPlan {
  @Prop({ required: true })
  dayNumber: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [StudyTask], default: [] })
  tasks: StudyTask[];
}

@Schema({ timestamps: true })
export class StudyPlan {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: [DailyPlan], default: [] })
  dailyTasks: DailyPlan[];
}

export const StudyPlanSchema = SchemaFactory.createForClass(StudyPlan);
StudyPlanSchema.index({ userId: 1 });
