import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

enum Role {
    ADMIN = "ADMIN",
    RECEPTIONIST = "RECEPTIONIST"
}

export class CreateUserDto{
    @ApiProperty({ description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
    @ApiProperty({ description: 'Last name of the user' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
    @ApiProperty({ description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @ApiProperty({ description: 'Password for the user account' })
    @IsString()
    @IsNotEmpty()
    password: string;
    @ApiProperty({ enum: Role, description: 'Role of the user (ADMIN or RECEPTIONIST)' })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}