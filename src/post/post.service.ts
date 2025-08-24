import { Injectable, NotFoundException } from '@nestjs/common';
import { PostInterface } from './interfaces/post.interface';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {

    constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) { }
    private posts: PostInterface[] = [
        {
            id: 1,
            title: "first",
            content: "First Post Content",
            authorName: "Asn",
            createdAt: new Date()
        }
    ]

    async findAll(): Promise<Post[]> {
        return this.postRepository.find();
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postRepository.findOneBy({ id });
        if (!post) {
            throw new NotFoundException("Post Not Found");
        }
        return post;
    }

    create(createPostPayload: CreatePostDto): Promise<Post> {
        const newPost = this.postRepository.create({
            authorName: createPostPayload.authorName,
            content: createPostPayload.content,
            title: createPostPayload.title
        })
        return this.postRepository.save(newPost);
    }

    async update(id: number, updatePostPayload: UpdatePostDto) {
        const exist = await this.findOne(id);
        if (updatePostPayload.title) {
            exist.title = updatePostPayload.title;
        }

        if (updatePostPayload.authorName) {
            exist.authorName = updatePostPayload.authorName;
        }

        if (updatePostPayload.content) {
            exist.content = updatePostPayload.content;
        }
        return await this.postRepository.save(exist);

    }

    async remove(id: number) {
        const findPostToDelete = await this.findOne(id);
        return this.postRepository.remove(findPostToDelete);
    }
}
