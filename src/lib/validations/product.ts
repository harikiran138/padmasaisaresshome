import { z } from "zod";

const variantSchema = z.object({
  sku: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  additionalPrice: z.coerce.number().min(0).default(0),
});

export const productSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  variants: z.array(variantSchema).optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
