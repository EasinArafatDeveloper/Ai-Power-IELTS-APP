import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { Progress, ProgressDocument } from '../schemas/progress.schema';

@Injectable()
export class ProgressRepository extends BaseRepository<ProgressDocument> {
  constructor(
    @InjectModel(Progress.name)
    progressModel: Model<ProgressDocument>,
  ) {
    super(progressModel);
  }
}
