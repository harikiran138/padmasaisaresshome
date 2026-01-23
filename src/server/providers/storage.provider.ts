import fs from 'fs';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';

export interface IStorageProvider {
    save(file: Buffer, filename: string): Promise<string>;
    delete(filename: string): Promise<void>;
}

export class LocalStorageProvider implements IStorageProvider {
    private uploadDir: string;

    constructor() {
        this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
        // Ensure directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async save(file: Buffer, filename: string): Promise<string> {
        const filePath = path.join(this.uploadDir, filename);
        await writeFile(filePath, file);
        return `/uploads/${filename}`;
    }

    async delete(filename: string): Promise<void> {
        const filePath = path.join(this.uploadDir, filename);
        try {
           await unlink(filePath);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        }
    }
}
