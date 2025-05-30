import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from '@prisma/client'
import { notificationQueue } from '../queue/notification.queue'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto)

    return user
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id)
  }
}
