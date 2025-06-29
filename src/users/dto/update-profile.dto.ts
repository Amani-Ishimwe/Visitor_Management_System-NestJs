
import { IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
        @IsString()
        @IsNotEmpty()
        firstName: string;
        @IsString()
        @IsNotEmpty()
        lastName: string;
        file: any;
}
