import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class LoginDTo {
    @IsEmail({}, { message: "Please Provide a valid email" })
    email: string;

    @IsNotEmpty({ message: "Password is required! Please provide password" })
    @MinLength(6, { message: "Password must be atleast 6 characters long" })
    password: string;


}