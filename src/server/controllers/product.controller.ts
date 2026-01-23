import { NextRequest, NextResponse } from "next/server";
import { productService } from "../services/product.service";
import { handleError } from "../utils/AppError";
import { productSchema } from "@/lib/validations/product";
import { z } from "zod";

export class ProductController {
    
    async create(req: NextRequest) {
        try {
            const body = await req.json();
            const validation = productSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
            }

            const product = await productService.createProduct(validation.data);
            return NextResponse.json({ success: true, data: product }, { status: 201 });
        } catch (error) {
            return this.sendError(error);
        }
    }

    async update(req: NextRequest, id: string) {
        try {
            const body = await req.json();
            const validation = productSchema.safeParse(body);
             if (!validation.success) {
                return NextResponse.json({ success: false, error: validation.error.flatten().fieldErrors }, { status: 400 });
            }

            const product = await productService.updateProduct(id, validation.data);
            return NextResponse.json({ success: true, data: product });
        } catch (error) {
            return this.sendError(error);
        }
    }

    async getById(req: NextRequest, id: string) {
        try {
            const product = await productService.getProductById(id);
            return NextResponse.json({ success: true, data: product });
        } catch (error) {
            return this.sendError(error);
        }
    }

    async delete(req: NextRequest, id: string) {
        try {
            await productService.deleteProduct(id);
            return NextResponse.json({ success: true, message: "Product deleted" });
        } catch (error) {
            return this.sendError(error);
        }
    }

    async getAll(req: NextRequest) {
        try {
            const searchParams = req.nextUrl.searchParams;
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '10');
            const search = searchParams.get('search') || '';
            const category = searchParams.get('category') || '';
            const sort = searchParams.get('sort') || 'newest';
            const isFeatured = searchParams.get('isFeatured') || undefined;

            const result = await productService.getProducts({ page, limit, search, category, sort, isFeatured });
            return NextResponse.json({ success: true, ...result });
        } catch (error) {
            return this.sendError(error);
        }
    }

    private sendError(error: unknown) {
        const errResponse = handleError(error);
        return NextResponse.json(errResponse, { status: errResponse.statusCode });
    }
}

export const productController = new ProductController();
