
"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";
import { productSchema } from "@/lib/validations/product";
import { productService } from "@/server/services/product.service";

async function handleFileUpload(formData: FormData): Promise<string | null> {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return null;

    // Validate mime type
    if (!file.type.startsWith("image/")) {
        throw new Error("Invalid file type. Only images are allowed.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replace(/\s/g, "_");
    const relativePath = "/uploads/" + filename;
    const absolutePath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(absolutePath, buffer);
    return relativePath;
}

export async function createProduct(formData: FormData) {
    try {
        await connectToDatabase();

        // 1. Extract raw data
        const rawData = {
            name: formData.get("name"),
            price: Number(formData.get("price")),
            category: formData.get("category"),
            brand: formData.get("brand"),
            description: formData.get("description"),
            stock: Number(formData.get("stock")),
            images: [formData.get("image") as string], // Initial
            isActive: formData.get("isActive") === "on",
            variants: formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [],
            attributes: formData.get("attributes") ? JSON.parse(formData.get("attributes") as string) : {},
        };

        // 2. Handle File Upload (if present) to update images
        const uploadedImagePath = await handleFileUpload(formData);
        if (uploadedImagePath) {
            rawData.images = [uploadedImagePath];
        }

        // 3. Zod Validation
        const validatedData = productSchema.parse(rawData);

        // 4. Create Product via Service
        await productService.createProduct(validatedData);

        revalidatePath("/admin/products");
    } catch (error) {
        console.error("Create Product Error:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to create product");
    }
}

export async function updateProduct(formData: FormData) {
    try {
        const id = formData.get("id") as string;

        const rawData = {
           name: formData.get("name"),
           price: Number(formData.get("price")),
           category: formData.get("category"),
           brand: formData.get("brand"),
           description: formData.get("description"),
           stock: Number(formData.get("stock")),
           images: [formData.get("image") as string],
           isActive: formData.get("isActive") === "on",
           variants: formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [],
           attributes: formData.get("attributes") ? JSON.parse(formData.get("attributes") as string) : {},
       };

        const uploadedImagePath = await handleFileUpload(formData);
        if (uploadedImagePath) {
            rawData.images = [uploadedImagePath];
        }

       const validatedData = productSchema.parse(rawData);

       // Service Call
       await productService.updateProduct(id, validatedData);

        revalidatePath("/admin/products");
    } catch (error) {
        console.error("Update Product Error:", error);
        throw new Error("Failed to update product");
    }
    redirect("/admin/products");
}
