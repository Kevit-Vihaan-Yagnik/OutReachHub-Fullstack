import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ContactModule } from './contact/contact.module';
import { MessageTemplateModule } from './messageTemplate/template.moduel';
import { CampaignModule } from './campaign/campaign.module';

@Module({
  imports: [
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
export class AppModule {}
