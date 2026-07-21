import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../base.repository';
import { Vocabulary, VocabularyDocument } from '../schemas/vocabulary.schema';

@Injectable()
export class VocabularyRepository extends BaseRepository<VocabularyDocument> {
  constructor(
    @InjectModel(Vocabulary.name)
    vocabularyModel: Model<VocabularyDocument>,
  ) {
    super(vocabularyModel);
  }
}
