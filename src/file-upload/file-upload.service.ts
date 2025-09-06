import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from 'src/auth/entities/user.entity';
import { File } from './entites/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
    constructor(private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(File) private readonly fileRepository: Repository<File>
    ) {

    }

    async uploadFile(file: Express.Multer.File, description: string | undefined, user: User): Promise<File> {
        const cloduinaryResponse = await this.cloudinaryService.upload(file);
        const newCreatedFile = this.fileRepository.create({
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            publicId: cloduinaryResponse?.public_id,
            url: cloduinaryResponse?.secure_url,
            description,
            uploader: user
        })
        return this.fileRepository.save(newCreatedFile);
    }

    async findAll(): Promise<File[]> {
        return this.fileRepository.find({
            relations: { uploader: true },
            order: {
                createdAt: "DESC"
            }
        })
    }

    async remove(id: string): Promise<void> {
        const fileToBeDeleted = await this.fileRepository.findOne({
            where: {
                id
            }
        })

        if (!fileToBeDeleted) {
            throw new NotFoundException("file with this id not found");
        }

        await Promise.all([
            await this.cloudinaryService.deleteFile(fileToBeDeleted.publicId),
            await this.fileRepository.remove(fileToBeDeleted)
        ])

    }
}
