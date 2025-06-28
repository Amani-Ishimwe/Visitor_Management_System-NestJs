import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';

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
}
