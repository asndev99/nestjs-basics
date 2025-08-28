import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";



export class PaginationQueryDTO {
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "page must be a number" })
    @Min(1, { message: "page must be atleast 1" })
    page?: number;


    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "Limit must be an integer" })
    @Min(1, { message: "Limit must be atleast 1" })
    @Max(100, { message: "Limit can't exceed 1000" })
    limit?: number;
}