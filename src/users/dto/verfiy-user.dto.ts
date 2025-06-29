import { IsNotEmpty, IsString } from "class-validator";

export class verifyUserDto{
    @IsString()
    @IsNotEmpty()
    email:string;
}