import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
