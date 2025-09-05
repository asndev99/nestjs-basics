import { Inject, Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import * as streamfier from "streamifier"


@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private readonly cloudinary: any) {

    }

    async upload(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream(
                {
                    folder: "nestjs-basics",
                    resource_type: "auto",
                },
                (error: UploadApiErrorResponse, result: UploadApiResponse) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            uploadStream.end(file.buffer);
        });
    }

    async deleteFile(publicId: string): Promise<any> {
        return this.cloudinary.uploader.destroy(publicId);
    }


}