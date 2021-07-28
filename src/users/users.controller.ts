import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getCurrentUser(@CurrentUser() user) {
    return user;
  }

  @Post()
  signUp(@Body() body: JoinRequestDto) {
    return this.usersService.signUp(body);
  }

  @Post('login')
  logIn(@CurrentUser() user) {
    return user;
  }

  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
