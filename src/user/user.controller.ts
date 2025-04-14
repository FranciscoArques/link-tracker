import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: { email: string; password: string }): Promise<User> {
    const { email, password } = body;
    return this.userService.createUser(email, password);
  }

  @Get()
  async show(): Promise<User[]> {
    return this.userService.showUsers();
  }
}
