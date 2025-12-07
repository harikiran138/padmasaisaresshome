
"use server";

import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
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

export async function createCategory(formData: FormData) {
    await connectToDatabase();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string || name.toLowerCase().replace(/ /g, "-");
    const description = formData.get("description") as string;
    let image = formData.get("image") as string;
    const isActive = formData.get("isActive") === "on";

    const uploadedImagePath = await handleFileUpload(formData);
    if (uploadedImagePath) {
        image = uploadedImagePath;
    }

    await Category.create({
        name,
        slug,
        description,
        image,
        isActive,
    });

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}

export async function updateCategory(formData: FormData) {
    await connectToDatabase();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    let image = formData.get("image") as string;
    const isActive = formData.get("isActive") === "on";

    const uploadedImagePath = await handleFileUpload(formData);
    if (uploadedImagePath) {
        image = uploadedImagePath;
    }

    await Category.findByIdAndUpdate(id, {
        name,
        slug,
        description,
        image,
        isActive,
    });

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}
