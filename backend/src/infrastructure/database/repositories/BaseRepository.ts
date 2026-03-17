
import {Model,Document,UpdateQuery} from "mongoose";
import {injectable, unmanaged} from "inversify";
import { IBaseRepository } from "../../../domain/interfaces/IBaseRepository";


@injectable()

export abstract class BaseRepository<T,TDoc extends Document> implements IBaseRepository<T>{
    constructor(
        @unmanaged() private model:Model<TDoc>,
        @unmanaged() private mapper:(doc:TDoc)=>T
    ){}
    async create(entity: T): Promise<T> {
        const created=await this.model.create(entity);
        return this.mapper(created);
    }
    async findById(id: string): Promise<T | null> {
        const doc=await this.model.findById(id);
        return doc? this.mapper(doc) : null;
    }
    async update(id: string, data: Partial<T>): Promise<T | null> {
        const updated=await this.model.findByIdAndUpdate(id,data as unknown as UpdateQuery<TDoc>,{new:true});
        return updated? this.mapper(updated):null;
    }
    async delete(id: string): Promise<boolean> {
        const result=await this.model.findByIdAndDelete(id);
        return !!result;
    }
}