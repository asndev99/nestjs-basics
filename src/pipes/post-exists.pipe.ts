import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { PostService } from "src/post/post.service";


@Injectable()
export class PostExistsPipe implements PipeTransform {
    constructor(private readonly postService: PostService) { }

    transform(value: any, metadata: ArgumentMetadata) {
        try {
            this.postService.findOne(value);
        }
        catch (e) {
            throw new NotFoundException(`Post with ID ${value} not found`);
        }
        return value;
    }
}