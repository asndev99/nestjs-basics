import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { PostExistsPipe } from 'src/pipes/post-exists.pipe';
import { Post as PostInterface } from './entities/post.entity';

@Controller('post')
export class PostController {
    constructor(private readonly postSerivce: PostService) {
    }

    @Get()
    async findAll(@Query('search') search?: string): Promise<PostInterface[]> {
        return this.postSerivce.findAll();
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe, PostExistsPipe) id: number) {
        return this.postSerivce.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createPostData: CreatePostDto) {
        return this.postSerivce.create(createPostData);
    }

    @Put(":id")
    async update(
        @Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Body() updatePostData: UpdatePostDto) {
        return this.postSerivce.update(id, updatePostData);
    }

    @Delete(":id")
    async remove(@Param('id', ParseIntPipe, PostExistsPipe) id: number) {
        return this.postSerivce.remove(id);
    }

}
