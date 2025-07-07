import { EmailService } from './../email/email.service';

import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma';
import * as argon2 from 'argon2';
import * as otpGen from 'otp-generator'
import { generateToken } from 'src/utils/jwtutil';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';



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
        const confirmUrl = `http://localhost:3000/users/verify/${savedUser.id}/${savedUser.email}`;
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

    //verification of user
async verifyUser(id: string, email: string): Promise<{ message: string }> {
  // Find user by id and email
  const user = await this.prismaService.user.findUnique({
    where: { id },
  });

  if (!user || user.email !== email) {
    throw new BadRequestException('Invalid verification link or user not found.');
  }

  if (user.verified) {
    return { message: 'User already verified.' };
  }


  // Mark user as verified
  await this.prismaService.user.update({
    where: { id },
    data: { verified: true },
  });

  return { message: 'User verified successfully.' };
}
    
    //update profile
    async update(
        id: string,
        user: User,
        file: Express.Multer.File
    ): Promise<User> {
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
        return updateUser;
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

    async resetPasswordEmail(
    user: User,
    passwords: ResetPasswordDto,
  ): Promise<{ msg: string; loginUrl: string }> {
    const available = await this.prismaService.user.findUnique({
      where: { id: user.id, email: user.email },
    });
    //  check is user is truly him
    if (!available)
      throw new UnauthorizedException(
        'please provide valid id and email you have received on email',
      );

    // check if passwords matches
    if (!(passwords.password === passwords.confirmPassword))
      throw new BadRequestException(' passwords are not match');
    const hashedPassword = await argon2.hash(passwords.password);

    //  check if  he provided already password  he use
    const isCurrentPassword = await argon2.verify(
      available.password,
      passwords.password,
    );
    if (isCurrentPassword)
      throw new BadRequestException(
        'that is your current password, please choose another password',
      );
    await this.prismaService.user.update({
      where: { id: user.id, email: user.email },
      data: {
        password: hashedPassword,
      },
    });

    // respond
    return {
      msg: 'to reset your password have been successfully , now you can  login with that password',
      loginUrl: 'localhost:3000/users/login',
    };
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


    async remove(id:string){
        const deletedUser = await this.prismaService.user.delete({
            where:{
               id
            }
        })
          return {deletedUser}
    }
    getAccountDetails(user: User, id: string) {
    if (id == null) throw new BadRequestException('please provide your id');
    if (id !== user.id) throw new BadRequestException(' that is not your id ');
    // return user
    return { user };
  }

}

