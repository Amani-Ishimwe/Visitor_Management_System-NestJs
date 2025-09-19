import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Department, Visitor } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
    constructor(
        private readonly emailService:MailerService
    ){}

    async sendEmail(confirmUrl: string, user:User){
        await this.emailService.sendMail({
            to : user.email,
            subject:'Confirm Your Email',
            template: './welcome',
            context:{
                name: user.firstName,
                confirmUrl:confirmUrl
            }
        })
    }
    // Reset Password Email 
    async resetPassword(email:string,user:User,otp:string){
        await this.emailService.sendMail({
            to:user.email,
            subject:'Reset Your Password',
            template: './resetPassword',
            context:{
                name: user.firstName,
                otp: otp
            }
        })
    }

    async sendId(email:string, visitor:Visitor, id:string){
        await this.emailService.sendMail({
            to:visitor.email,
            subject:"ID Delivery",
            template:"./sendId",
            context:{
                name:visitor.firstName,
                id:id
            }
        })
    }
    //sending id  confirmation to department
    async sendIdDepartment(email:string, department:Department, id:string){
        await this.emailService.sendMail({
            to:department.email,
            subject:"ID Delivery",
            template:"./sendId",
            context:{
                name:department.name,
                id:id
            }
        })
    }

}
