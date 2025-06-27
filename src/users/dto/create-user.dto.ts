import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

enum Role {
    ADMIN = "ADMIN",
    RECEPTIONIST = "RECEPTIONIST"
}

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}