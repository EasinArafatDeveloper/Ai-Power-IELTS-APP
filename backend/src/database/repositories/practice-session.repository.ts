import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { PracticeSession, PracticeSessionDocument } from '../schemas/practice-session.schema';

@Injectable()
export class PracticeSessionRepository extends BaseRepository<PracticeSessionDocument> {
  constructor(
    @InjectModel(PracticeSession.name)
    practiceSessionModel: Model<PracticeSessionDocument>,
  ) {
    super(practiceSessionModel);
  }
}
