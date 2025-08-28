import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { PostExistsPipe } from 'src/pipes/post-exists.pipe';
import { Post as PostInterface } from './entities/post.entity';
import { CurrenUser } from 'src/auth/decorators/currentuser.decorator';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { FindPostQueryDto } from './dto/find-post-query.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postSerivce: PostService) {
    }

    @Get()
    async findAll(@Query() findPostQueryDto: FindPostQueryDto): Promise<PaginatedResponse<PostInterface>> {
        return this.postSerivce.findAll(findPostQueryDto);
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe, PostExistsPipe) id: number) {
        return this.postSerivce.findOne(id);
    }

    @Roles(UserRole.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createPostData: CreatePostDto, @CurrenUser() user: User) {
        return this.postSerivce.create(createPostData, user);
    }


    @Roles(UserRole.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(":id")
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePostData: UpdatePostDto, @CurrenUser() user: User) {
        return this.postSerivce.update(id, updatePostData, user);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(":id")
    async remove(@Param('id', ParseIntPipe, PostExistsPipe) id: number) {
        return this.postSerivce.remove(id);
    }

}
