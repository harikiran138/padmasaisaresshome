
"use server";

import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import path from "path";

async function handleFileUpload(formData: FormData): Promise<string | null> {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return null;

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

        const name = formData.get("name") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;
        const brand = formData.get("brand") as string;
        const description = formData.get("description") as string;
        const stock = Number(formData.get("stock"));
        let image = formData.get("image") as string;
        const isActive = formData.get("isActive") === "on";

        const uploadedImagePath = await handleFileUpload(formData);
        if (uploadedImagePath) {
            image = uploadedImagePath;
        }

        // Parse Variants
        const variantsJson = formData.get("variants") as string;
        const variants = variantsJson ? JSON.parse(variantsJson) : [];

        // Parse Attributes
        const attributesJson = formData.get("attributes") as string;
        const attributesMap = attributesJson ? JSON.parse(attributesJson) : {};

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

        await Product.create({
            name,
            slug,
            price,
            category, // ObjectId
            brand,
            description,
            stock, // Base stock
            images: [image],
            isActive,
            currency: "INR",
            variants,
            attributes: attributesMap,
            // Legacy fields for backward compatibility or simple products
            sizes: variants.map((v: any) => v.size).filter(Boolean),
            colors: variants.map((v: any) => v.color).filter(Boolean),
        });

        revalidatePath("/admin/products");
    } catch (error) {
        console.error("Create Product Error:", error);
        throw new Error("Failed to create product");
    }
}

export async function updateProduct(formData: FormData) {
    try {
        await connectToDatabase();

        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;
        const brand = formData.get("brand") as string;
        const description = formData.get("description") as string;
        const stock = Number(formData.get("stock"));
        let image = formData.get("image") as string;
        const isActive = formData.get("isActive") === "on";

        const uploadedImagePath = await handleFileUpload(formData);
        if (uploadedImagePath) {
            image = uploadedImagePath;
        }

        // Parse Variants
        const variantsJson = formData.get("variants") as string;
        const variants = variantsJson ? JSON.parse(variantsJson) : [];

        // Parse Attributes
        const attributesJson = formData.get("attributes") as string;
        const attributesMap = attributesJson ? JSON.parse(attributesJson) : {};

        await Product.findByIdAndUpdate(id, {
            name,
            price,
            category,
            brand,
            description,
            stock,
            images: [image], // Basic image handling for now
            isActive,
            variants,
            attributes: attributesMap,
            // Legacy sync
            sizes: variants.map((v: any) => v.size).filter(Boolean),
            colors: variants.map((v: any) => v.color).filter(Boolean),
        });

        revalidatePath("/admin/products");
    } catch (error) {
        console.error("Update Product Error:", error);
        throw new Error("Failed to update product");
    }
    redirect("/admin/products");
}
