import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  firebaseUid: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 0 })
  targetBand: number;

  @Prop({ default: null })
  examDate: Date;

  @Prop({ default: false })
  onboardingCompleted: boolean;

  @Prop({ default: false })
  assessmentCompleted: boolean;

  @Prop({ default: 0 })
  streakCount: number;

  @Prop({ default: null })
  lastActive: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ firebaseUid: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
