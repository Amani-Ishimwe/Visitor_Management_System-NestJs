import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma';
import * as argon2 from 'argon2';
import { generateToken } from 'src/utils/jwtutil';


@Injectable()
export class UsersService {
    constructor(
      private readonly prismaService: DatabaseService,
    ){}


    //register
    async create(
        createUserDto:CreateUserDto
    ):Promise<{ user: User;}>{
        const user = await this.prismaService.user.findUnique({
            where:{email:createUserDto.email}
        })
        if(user){
            throw new BadRequestException('User already exists')
        }

        const hashedPassword = await argon2.hash(createUserDto.password)
        const savedUser = await this.prismaService.user.create({
            data:{
                firstName:createUserDto.firstName,
                lastName:createUserDto.lastName,
                email:createUserDto.email,
                password:hashedPassword,
                role:createUserDto.role
            }
        })
        return { user: savedUser };
    }


    //login

    async login(
        createUserDto: CreateUserDto
    ):Promise<{ user: User; token: string}>{
        //check if user exists
        const user = await this.prismaService.user.findUnique({
            where:{email:createUserDto.email}
        })
        if(!user){
            throw new BadRequestException('User does not exist')
        }
        const isPasswordValid = await argon2.verify(user.password, createUserDto.password)
        if(!isPasswordValid){
            throw new BadRequestException('Invalid Password')
        }
        const token = await generateToken(user.email, user.role, user.id)
        return { user, token }
    }
}
