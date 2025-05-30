import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { User } from '@prisma/client'
import { notificationQueue } from '../queue/notification.queue'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        id: this.generateShortId(10),
        ...createUserDto
      }
    })

    this.logger.log(`User created successfully: ${user.id} ${user.name}`)

    await notificationQueue.add(
      'send-push',
      {
        userId: user.id,
        name: user.name
      },
      {
        //delay: 10000, // 10 seconds for testing
        delay: 24 * 60 * 60 * 1000, // 24 hours
        attempts: 2
      }
    )

    return user
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async remove(id: string): Promise<User> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id }
      })

      this.logger.log(
        `User deleted successfully: ${deletedUser.id} (${deletedUser.name})`,
        'UserService'
      )

      return deletedUser
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }

  private generateShortId(n: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
}
