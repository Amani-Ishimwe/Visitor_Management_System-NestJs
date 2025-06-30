import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserDto{
    @ApiProperty({ description: 'Email address to verify' })
    @IsString()
    @IsNotEmpty()
    email:string;
}