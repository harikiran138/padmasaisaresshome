import { BaseRepository } from "./base.repository";
import Cart, { ICart } from "@/models/Cart";
import { Document } from "mongoose";

export class CartRepository extends BaseRepository<ICart & Document> {
    constructor() {
        super(Cart);
    }

    async findByUserId(userId: string): Promise<ICart & Document | null> {
        return await this.model.findOne({ user: userId }).populate('items.product');
    }

    async findBySessionId(sessionId: string): Promise<ICart & Document | null> {
        return await this.model.findOne({ sessionId }).populate('items.product');
    }

    async findByUserIdOrSessionId(userId?: string, sessionId?: string): Promise<ICart & Document | null> {
        if (userId) return this.findByUserId(userId);
        if (sessionId) return this.findBySessionId(sessionId);
        return null;
    }
}
