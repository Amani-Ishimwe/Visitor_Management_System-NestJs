import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateVisitorDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName:string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName:string;
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email:string;
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{10}$/,{message:"Phone number must be 10 digits"})
    @ApiProperty()
    phone:string;
}
