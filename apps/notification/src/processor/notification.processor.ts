import { Injectable, OnModuleInit } from '@nestjs/common'
import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import { NotificationService } from '../services/notification.service'

@Injectable()
export class NotificationProcessor implements OnModuleInit {
  private connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null
  })

  constructor(private readonly notificationService: NotificationService) {}

  onModuleInit() {
    new Worker(
      'notification-queue',
      async (job) => {
        const { userId, name } = job.data
        console.log(
          `[Worker] Processing notification job for ${name} (userId: ${userId})...`
        )

        const result = await this.notificationService.sendPushNotification(
          userId,
          name
        )

        if (result.success) {
          console.log(
            `[Worker] Successfully processed notification: ${result.message}`
          )
        } else {
          throw new Error(`Failed to process notification: ${result.message}`)
        }

        return result
      },
      {
        connection: this.connection
      }
    ).on('failed', (job, err) => {
      console.error(`[Worker] Job ${job?.id} failed:`, err.message)
    })
  }
}
