import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDTO } from "src/common/dto/paginationQuery.dto";


export class FindPostQueryDto extends PaginationQueryDTO {
    @IsOptional()
    @IsString({ message: "Title must be a string" })
    @MaxLength(100, { message: "Title search can't exceed 100 characters" })
    title?: string;

}