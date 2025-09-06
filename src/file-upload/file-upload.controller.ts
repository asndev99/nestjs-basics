import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrenUser } from 'src/auth/decorators/currentuser.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('file-upload')
export class FileUploadController {
    constructor(private readonly fileService: FileUploadService) {

    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadFileDto: any,
        @CurrenUser() user: User

    ): Promise<any> {
        if (!file) {
            throw new BadRequestException("File is required");
        }
        return this.fileService.uploadFile(file, uploadFileDto.description, user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.fileService.findAll();
    }

    @Delete(":id")
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        await this.fileService.remove(id);
        return {
            message: "File Deleted Successfully"
        }
    }

}
