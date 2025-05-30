import { NestFactory } from '@nestjs/core'
import { NotificationModule } from './notification.module'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger('NotificationApp')
  const app = await NestFactory.create(NotificationModule)
  const port = process.env.PORT_N ?? 3001
  await app.listen(port)
  logger.log(`Notification service is running on: http://localhost:${port}`)
}
bootstrap()
