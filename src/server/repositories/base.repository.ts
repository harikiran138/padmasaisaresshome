import { Model, Document, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T> | any, options: Record<string, any> = {}): Promise<T> {
        if (Array.isArray(data)) {
            const results = await this.model.create(data, options);
            return results[0] as unknown as T;
        }
        return (await this.model.create(data)) as unknown as T;
    }

    async findOne(filter: Record<string, any>): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async find(filter: Record<string, any> = {}, limit: number = 10, skip: number = 0): Promise<T[]> {
        return await this.model.find(filter).skip(skip).limit(limit);
    }

    async update(id: string, data: UpdateQuery<T>, options: Record<string, any> = {}): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true, ...options });
    }

    async delete(id: string, options: Record<string, any> = {}): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, { deletedAt: new Date() } as unknown as UpdateQuery<T>, { new: true, ...options });
    }
}
