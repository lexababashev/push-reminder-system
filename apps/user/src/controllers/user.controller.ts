import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode
} from '@nestjs/common'
import { UserService } from '../services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { User } from '@prisma/client'

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.UserService.create(createUserDto)
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.UserService.findById(id)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.UserService.remove(id)
  }
}
