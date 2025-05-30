import { NestFactory } from '@nestjs/core'
import { NotificationModule } from './src/notification.module'
import { Logger, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger('NotificationApp')
  const app = await NestFactory.create(NotificationModule)

  app.useGlobalPipes(new ValidationPipe())

  const port = process.env.PORT_N ?? 3001
  await app.listen(port)
  logger.log(`Notification service is running on: http://localhost:${port}`)
}
bootstrap()
