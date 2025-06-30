import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ResetPasswordDto{
    @ApiProperty({ description: 'New password' })
    @IsString()
    @IsNotEmpty()
    password:string;

    @ApiProperty({ description: 'Confirmation of the new password' })
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}