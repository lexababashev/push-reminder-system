import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import { PrismaService } from './services/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule {}
