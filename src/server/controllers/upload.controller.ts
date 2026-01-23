import { NextRequest, NextResponse } from "next/server";
import { uploadService } from "../services/upload.service";
import { handleError } from "../utils/AppError";

export class UploadController {
    
    async upload(req: NextRequest, userId: string) {
        try {
            const formData = await req.formData();
            const file = formData.get("file") as File;

            if (!file) {
                return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
            }

            const media = await uploadService.uploadFile(file, userId);
            
            return NextResponse.json({ 
                success: true, 
                message: "File uploaded successfully",
                url: media.path,
                id: media._id
            }, { status: 201 });

        } catch (error) {
            return this.sendError(error);
        }
    }

    private sendError(error: unknown) {
        const errResponse = handleError(error);
        return NextResponse.json(errResponse, { status: errResponse.statusCode });
    }
}

export const uploadController = new UploadController();
