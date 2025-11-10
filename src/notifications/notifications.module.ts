import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailService } from './mail.service';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    AuthModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, MailService],
  exports: [NotificationsService, MailService],
})
export class NotificationsModule {}