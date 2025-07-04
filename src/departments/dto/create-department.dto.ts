import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name:string;
    @IsString()
    @IsOptional()
    @ApiProperty()
    description?:string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email:string;
}
