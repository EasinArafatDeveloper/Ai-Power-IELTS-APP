import { Document, Model } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(doc: any): Promise<T> {
    const createdEntity = new this.model(doc);
    return createdEntity.save() as Promise<T>;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(
    filter: any,
    projection?: any,
    options?: any
  ): Promise<T | null> {
    return this.model.findOne(filter, projection, options).exec();
  }

  async find(
    filter: any,
    projection?: any,
    options?: any
  ): Promise<T[]> {
    return this.model.find(filter, projection, options).exec();
  }

  async update(
    filter: any,
    update: any,
    options?: any
  ): Promise<any> {
    return this.model.findOneAndUpdate(filter, update, { new: true, ...options }).exec();
  }

  async delete(filter: any): Promise<any> {
    return this.model.deleteOne(filter).exec();
  }
}
