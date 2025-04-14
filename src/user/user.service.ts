import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(
    email: string,
    password: string,
    firstName: string,
  ): Promise<User> {
    try {
      const saltRounds = 8;
      const secret = this.configService.get<string>('BCRYPT_SECRET');
      const hashedPassword = await bcrypt.hash(password + secret, saltRounds);
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        firstName,
      });
      return this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'Cannot create user',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch, 'isMatch');
      return 'Ok';
    } catch (error) {
      throw new HttpException('Cannot login', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async showUsers() {
    return this.userRepository.find();
  }
}
