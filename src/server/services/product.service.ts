import { ProductRepository } from "../repositories/product.repository";
import { ProductInput } from "@/lib/validations/product";
import { AppError } from "../utils/AppError";
import connectToDatabase from "@/lib/db";

const productRepo = new ProductRepository();

export class ProductService {
  async createProduct(data: ProductInput) {
    await connectToDatabase();
    
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    
    // Transform input to Model format
    const productData: any = {
      ...data,
      slug,
      currency: "INR",
      sizes: data.variants?.map((v) => v.size).filter(Boolean) || [],
      colors: data.variants?.map((v) => v.color).filter(Boolean) || [],
      inventoryLog: [{
        date: new Date(),
        quantity: data.stock,
        reason: "Initial Stock"
      }]
    };

    const product = await productRepo.create(productData);
    return product;
  }

  async updateProduct(id: string, data: ProductInput) {
    await connectToDatabase();
    
    const product: any = await productRepo.findById(id);
    if (!product) throw new AppError("Product not found", 404);

    // Track stock changes
    if (data.stock !== product.stock) {
        const diff = data.stock - product.stock;
        product.inventoryLog.push({
            date: new Date(),
            quantity: diff,
            reason: "Manual Update"
        });
    }

    // Apply updates
    const updates = {
        ...data,
        sizes: data.variants?.map((v) => v.size).filter(Boolean) || [],
        colors: data.variants?.map((v) => v.color).filter(Boolean) || [],
        inventoryLog: product.inventoryLog
    };

    const updatedProduct = await productRepo.update(id, updates);
    return updatedProduct;
  }

  async getProducts(params: { page?: number; limit?: number; search?: string; category?: string; sort?: string; isFeatured?: string | boolean }) {
    await connectToDatabase();
    
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;
    
    const sort: any = {};
    if (params.sort === 'newest') sort.createdAt = -1;
    else if (params.sort === 'price_asc') sort.price = 1;
    else if (params.sort === 'price_desc') sort.price = -1;
    else sort.createdAt = -1;

    return await productRepo.findWithFilters(params, sort, limit, skip);
  }

  async getProductById(id: string) {
    await connectToDatabase();
    const product = await productRepo.findById(id);
    if (!product) throw new AppError("Product not found", 404);
    return product;
  }

  async deleteProduct(id: string) {
    await connectToDatabase();
    // Check if exists? Repo delete handles it? Repo delete works on ID.
    // If we want 404, we check first.
    const product = await productRepo.findById(id);
    if (!product) throw new AppError("Product not found", 404);
    
    return await productRepo.delete(id);
  }
}

export const productService = new ProductService();
