import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty({ message: "title is required" })
    @IsString({ message: "title must be a string" })
    @MinLength(3, { message: "title must be atleast 3 characters long" })
    @MaxLength(50, { message: "title cannot be longer than 50 characters" })
    title: string;

    @IsNotEmpty({ message: 'Content must be a string' })
    @IsString({ message: "Content must be a string" })
    @MinLength(3, { message: "Content must be atleast 5 characters long" })
    content: string


    @IsNotEmpty({message:"author must be a string"})
    @IsString({message:"Author must be a string"})
    @MinLength(2,{message:"Author must be 2 characters long"})
    @MaxLength(25,{message:"author name cannot be more than 25 characters"})
    authorName:string;
}