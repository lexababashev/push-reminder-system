import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
