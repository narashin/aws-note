import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [UsersModule, AccountsModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}