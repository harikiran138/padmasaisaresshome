import { BaseRepository } from "./base.repository";
import Order, { IOrder } from "@/models/Order";
import { Document } from "mongoose";

export class OrderRepository extends BaseRepository<IOrder & Document> {
    constructor() {
        super(Order);
    }

    async findByUserId(userId: string): Promise<(IOrder & Document)[]> {
        return await this.model.find({ user: userId }).sort({ createdAt: -1 });
    }

    async updateByOrderId(orderId: string, data: any) {
        return await this.model.findOneAndUpdate({ orderId }, data, { new: true });
    }
}
