import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { FindPostQueryDto } from './dto/find-post-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(Post) private readonly postRepository: Repository<Post>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {
    }
    private postListCacheKeys = new Set();

    private generatePostsListCacheKey(query: FindPostQueryDto): string {
        const { page = 1, limit = 10, title } = query;
        return `post_list_page${page}_limit${limit}_title${title || 'all'}`
    }

    private async invalidateAllExistingListCaches(): Promise<void> {
        console.log(`Invalidating ${this.postListCacheKeys} list cache entries`);
        for (const key of this.postListCacheKeys) {
            await this.cacheManager.del(key as string);
        }
        this.postListCacheKeys.clear();
    }

    async findAll(query: FindPostQueryDto): Promise<PaginatedResponse<Post>> {
        const cacheKey = this.generatePostsListCacheKey(query);
        this.postListCacheKeys.add(cacheKey);
        const getCacheData = await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);
        if (getCacheData) {
            console.log("Cache hit");
            return getCacheData;
        }
        const { page = 1, limit = 10, title } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.postRepository
            .createQueryBuilder('post').
            leftJoinAndSelect('post.author', 'name').orderBy('post.createdDate', 'DESC')
            .skip(skip).take(limit)

        if (title) {
            queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` })
        }

        const [items, totalItems] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(totalItems / limit);
        const result = {
            items,
            meta: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems,
                totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages
            }
        }
        await this.cacheManager.set(cacheKey, result);
        return result;


    }

    async findOne(id: number): Promise<Post> {
        const cacheKey = `post_${id}`;
        const cachedPost = await this.cacheManager.get<Post>(cacheKey);

        if (cachedPost) {
            console.log("Cache Hit");
            return cachedPost;
        }
        const post = await this.postRepository.findOneBy({ id });
        if (!post) {
            throw new NotFoundException("Post Not Found");
        }

        //store the post to cache
        await this.cacheManager.set(cacheKey, cachedPost);
        return post;
    }

    async create(createPostPayload: CreatePostDto, user: User): Promise<Post> {

        //Invalidate The Cache

        const newPost = this.postRepository.create({
            content: createPostPayload.content,
            title: createPostPayload.title,
            author: user
        })
        await this.invalidateAllExistingListCaches()
        return this.postRepository.save(newPost);
    }

    async update(id: number, updatePostPayload: UpdatePostDto, user: User) {
        const exist = await this.postRepository.findOne({
            where: {
                id,
                author: {
                    id: user.id
                }
            }
        });

        if (!exist) {
            throw new NotFoundException("Post Not Found to update");
        }
        if (updatePostPayload.title) {
            exist.title = updatePostPayload.title;
        }

        if (updatePostPayload.content) {
            exist.content = updatePostPayload.content;
        }
        await this.cacheManager.del(`post_${id}`);
        await this.invalidateAllExistingListCaches();
        return await this.postRepository.save(exist);

    }

    async remove(id: number) {
        const findPostToDelete = await this.findOne(id);
        await this.cacheManager.del(`post_${id}`);
        await this.invalidateAllExistingListCaches();
        return this.postRepository.remove(findPostToDelete);
    }
}
