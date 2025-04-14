import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDTO, LoginDTO } from './user.models';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDTO): Promise<User> {
    const { email, password, firstName } = body;
    return this.userService.createUser(email, password, firstName);
  }

  @Post()
  async login(@Body() body: LoginDTO): Promise<string> {
    const { email, password } = body;
    return this.userService.login(email, password);
  }

  @Get()
  async show(): Promise<User[]> {
    return this.userService.showUsers();
  }
}
