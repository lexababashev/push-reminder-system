import { Body, Controller, Post } from '@nestjs/common'
import { NotificationService } from '../services/notification.service'
import { SendNotificationDto } from '../dto/send-notification.dto'

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('push')
  async sendPushNotification(@Body() sendNotificationDto: SendNotificationDto) {
    const { userId, name } = sendNotificationDto
    return this.notificationService.sendPushNotification(userId, name)
  }
}
