import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: String, done: CallableFunction) {
    return await this.userRepository
      .findOneOrFail(
        { id: +userId },
        { select: ['id', 'email', 'name'], relations: ['Account'] },
      )
      .then((user: User) => {
        console.log('user', user);
        done(null, user);
      })
      .catch((error) => done(error));
  }
}
