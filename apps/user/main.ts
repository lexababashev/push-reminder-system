import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import {UserModule} from './src/user.module'

async function bootstrap() {
  const logger = new Logger('UserApp')
  const app = await NestFactory.create(UserModule)
  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.PORT_U ?? 3000
  await app.listen(port)
  logger.log(`User service is running on: http://localhost:${port}/api`)
}
bootstrap()
