import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)

  constructor() {}

  async sendPushNotification(
    userId: string,
    name: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const PUSH_URL = process.env.PUSH_URL
      if (!PUSH_URL) {
        throw new Error('PUSH_URL is not defined')
      }

      this.logger.log(`Sending direct push to ${name} (userId: ${userId})...`)

      await axios.post(PUSH_URL, {
        userId,
        message: `Hello ${name}, it's time for your push notification! 🚀`
      })

      this.logger.log(`Direct push sent to ${name}`)

      return {
        success: true,
        message: `Notification sent directly to user: ${name}`
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification: ${error.message}`,
        error.stack
      )
      return {
        success: false,
        message: `Failed to send notification: ${error.message}`
      }
    }
  }
}
