import { Injectable, Post } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';

@Injectable()
export class UsersService {
  signUp(body: JoinRequestDto) {
    const { email, name, password } = body;
  }
}
