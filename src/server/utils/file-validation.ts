import { AppError } from "./AppError";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const SIGNATURES: Record<string, number[]> = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
    'image/webp': [0x52, 0x49, 0x46, 0x46] // "RIFF" - partial check, usually good enough combined with 8th-11th char "WEBP"
    // Full WEBP check: 0-3 "RIFF", 8-11 "WEBP"
};

export function validateFileSize(size: number) {
    if (size > MAX_SIZE_BYTES) {
        throw new AppError(`File too large. Max size is ${MAX_SIZE_MB}MB`, 413);
    }
}

export function validateFileSignature(buffer: Buffer, mimeType: string) {
    // 1. Check if mime is allowed
    if (!Object.keys(SIGNATURES).includes(mimeType)) {
        throw new AppError("Unsupported file type", 415);
    }

    const signature = SIGNATURES[mimeType];
    
    // 2. Check Magic Bytes
    for (let i = 0; i < signature.length; i++) {
        if (buffer[i] !== signature[i]) {
            throw new AppError("Invalid file signature (File content does not match extension)", 400); 
        }
    }

    // Special case for WEBP: Check "WEBP" at offset 8
    if (mimeType === 'image/webp') {
       // "WEBP" in ASCII: 57 45 42 50
       if (buffer[8] !== 0x57 || buffer[9] !== 0x45 || buffer[10] !== 0x42 || buffer[11] !== 0x50) {
            throw new AppError("Invalid WEBP file signature", 400); 
       }
    }
}
