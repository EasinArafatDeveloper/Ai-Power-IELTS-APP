import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { StudyPlan, StudyPlanDocument } from '../schemas/study-plan.schema';

@Injectable()
export class StudyPlanRepository extends BaseRepository<StudyPlanDocument> {
  constructor(
    @InjectModel(StudyPlan.name)
    studyPlanModel: Model<StudyPlanDocument>,
  ) {
    super(studyPlanModel);
  }
}
