
"use server";

import { productService } from "@/server/services/product.service";
import { revalidatePath } from "next/cache";

export async function deleteProduct(formData: FormData) {
    try {
        const id = formData.get("id") as string;
        
        if (!id) {
            throw new Error("Product ID is required");
        }

        // Soft delete via service layer
        await productService.deleteProduct(id);
        
        revalidatePath("/admin/products");
    } catch (error) {
        console.error("Delete Product Error:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to archive product");
    }
}
