import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ContactModule } from './contact/contact.module';
import { MessageTemplateModule } from './messageTemplate/template.module';
import { CampaignModule } from './campaign/campaign.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // or Gmail, SendGrid, etc.
        port: 587,
        secure: false,
        auth: {
          user: 'outreechub@gmail.com',
          pass: process.env.APP_PASS,
        },
      },
      defaults: {
        from: '"OutReachHub" <noreply@outreachhub.com>',
      }
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    AuthModule,
    WorkspaceModule,
    ContactModule,
    MessageTemplateModule,
    CampaignModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
