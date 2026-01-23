import { LocalStorageProvider } from "../providers/storage.provider";
import { MediaRepository } from "../repositories/media.repository";
import { validateFileSize, validateFileSignature } from "../utils/file-validation";
import { AppError } from "../utils/AppError";
import connectToDatabase from "@/lib/db";
import { randomUUID } from "crypto";
import path from "path";

const storageProvider = new LocalStorageProvider();
const mediaRepo = new MediaRepository();

export class UploadService {
    
    async uploadFile(file: File, userId: string) {
        // 1. Validation
        validateFileSize(file.size);
        
        const buffer = Buffer.from(await file.arrayBuffer());
        validateFileSignature(buffer, file.type);

        // 2. Filename Generation
        const ext = path.extname(file.name) || ".png"; // Default to png if missing? Better to rely on mime.
        // Or extract from mime.
        const safeFilename = `${randomUUID()}${ext}`; // randomUUID is safe.

        // 3. Storage
        const publicUrl = await storageProvider.save(buffer, safeFilename);

        // 4. Metadata
        await connectToDatabase();
        const media = await mediaRepo.create({
            filename: safeFilename,
            originalName: file.name,
            path: publicUrl,
            mimeType: file.type,
            size: file.size,
            uploadedBy: userId,
            createdAt: new Date()
        });

        return media;
    }
}

export const uploadService = new UploadService();
