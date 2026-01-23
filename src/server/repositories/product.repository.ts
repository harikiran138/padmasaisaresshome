import { BaseRepository } from "./base.repository";
import Product, { IProduct } from "@/models/Product";
// Removed deprecated import

export class ProductRepository extends BaseRepository<IProduct & Document> {
    constructor() {
        super(Product);
    }

    async findWithFilters(filters: any, sort: any, limit: number, skip: number) {
        const query: Record<string, any> = { deletedAt: undefined };

        if (filters.category) query.category = filters.category;
        if (filters.isFeatured === 'true' || filters.isFeatured === true) query.isFeatured = true;

        if (filters.search) {
             query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } }
             ];
        }

        const products = await this.model.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('category');
            
        const total = await this.model.countDocuments(query);
        
        return { products, total };
    }

    /**
     * Atomically deduct stock for a product or specific variant.
     * Prevents race conditions by checking stock levels within the query.
     */
    async deductStock(productId: string, quantity: number, options?: { size?: string, color?: string }, session?: any) {
        let query: any = { _id: productId };
        let update: any = {
            $inc: {},
            $push: {
                inventoryLog: {
                    date: new Date(),
                    quantity: -quantity,
                    reason: "Order Placement"
                }
            }
        };

        if (options?.size || options?.color) {
            // Variant based deduction
            query["variants"] = { 
                $elemMatch: { 
                    stock: { $gte: quantity } 
                } 
            };
            if (options.size) query.variants.$elemMatch.size = options.size;
            if (options.color) query.variants.$elemMatch.color = options.color;

            // Use positional operator to update the specific variant
            update.$inc["variants.$.stock"] = -quantity;
        } else {
            // Simple product deduction
            query.stock = { $gte: quantity };
            update.$inc.stock = -quantity;
        }

        const result = await this.model.findOneAndUpdate(query, update, { session, new: true });
        
        if (!result) {
            throw new Error(`Insufficient stock or product not found: ${productId}`);
        }

        return result;
    }
}
