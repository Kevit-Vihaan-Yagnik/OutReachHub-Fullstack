import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    AuthModule,
    WorkspaceModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
