import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  imports:[
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
       transport:{
        host:config.get<string>('MAIL_HOST'),
        secure:false,
        auth:{
          user:config.get<string>('SMTP_USERNAME'),
          pass:config.get<string>('SMTP_PASSWORD')
        }
       },
       defaults: {
        from:`"VMS" <${config.get<string>('SMTP_USERNAME')}>`
       },
       template:{
        dir: join(__dirname,'templates'),
        adapter: new EjsAdapter(),
        options:{
          strict:false
        }
       }
      }),
      inject:[ConfigService],
    })
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
