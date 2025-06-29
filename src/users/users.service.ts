
import { EmailService } from './../email/email.service';

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma';
import * as argon2 from 'argon2';
import * as otpGen from 'otp-generator'
import { generateToken } from 'src/utils/jwtutil';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class UsersService {
    constructor(
      private readonly prismaService: DatabaseService,
      private readonly emailService: EmailService,
      private readonly cloudinaryService:CloudinaryService
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
        const confirmUrl = `http://localhost:3000/api/v1/user/verify/${savedUser.id}/${savedUser.email}`;
        await this.emailService.sendEmail(confirmUrl, savedUser);

        return {user: savedUser}
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
    
    //update profile
    async update(
        id:string,
        user:User,
        file: Express.Multer.File
    ){
        const uploadResult = await this.cloudinaryService.uploadFile(
            file,
            user.email.replace('@gmail.com','')
        );
        
        const updateUser = await this.prismaService.user.update({
            where: {id : id.trim() },
            data:{
                profile:uploadResult.secure_url,
            },
        })
    return updateUser
    }
    //send reset password request
    async resetPasswordRequest(email: string){
        const user = await this.prismaService.user.findUnique({
            where:{email: email.trim()}
        })
        if(!user) throw new BadRequestException("This user does not exists")
        const otp = await otpGen.generate(4,{
           digits: true,
           upperCaseAlphabets: false,
           specialChars: false,
           lowerCaseAlphabets: false,
    })
    
    await this.emailService.resetPassword(email,user,otp);
    await this.prismaService.oTP.deleteMany({
        where:{
            email,
        }
    })
    await this.prismaService.oTP.create({
        data:{
            email:email.trim(),
            otp:otp.trim(),
            createdAt:new Date()
        }
    })
    return {
        msg:"You have requested to change your password please check your email"
    }
    }

    //verification of OTP
    async verifyOTP(
        otp:string,
        email:string
    ):Promise<{msg:string , token?:string, userId?:string}>{
        const otpEntry = await this.prismaService.oTP.findFirst({
           where:{ email:email.trim(),
            otp:otp.trim()
           }
        })
    if(!otpEntry){
        throw new BadRequestException("Invalid OTP")
    }
    const expirationtime = new Date(otpEntry.createdAt.getTime() + 5*60000);
    const currentTime  = new Date()

    if(currentTime>expirationtime){
        throw new BadRequestException("OTP expired")
    }

    await this.deleteOTPEntry(otpEntry.id)

    const user = await this.prismaService.user.findUnique({
        where:{
            email,
        }
    })
    if(!user){
        throw new BadRequestException("User not found")
    }
    const token = await generateToken(user.email, user.role, user.id)
    return {
        msg:"opt verified",
        token,
        userId:user.id
    }
    }
 private async deleteOTPEntry(id: number): Promise<void> {
    await this.prismaService.oTP.delete({
      where: {
        id,
      },
    });
    }
}
