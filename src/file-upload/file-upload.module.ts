import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entites/file.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([File]), CloudinaryModule,
  MulterModule.register({
    storage: memoryStorage()
  }),
  CloudinaryModule
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService]
})
export class FileUploadModule { }
