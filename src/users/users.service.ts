import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JoinRequestDto } from './dto/join.request.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepostitory: Repository<User>,
  ) {}

  getUser() {}

  async join(body: JoinRequestDto) {
    const { email, name, password } = body;
    const user = await this.userRepostitory.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepostitory.save({
      email,
      name,
      password: hashedPassword,
    });
  }
}
