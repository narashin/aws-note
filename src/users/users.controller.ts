import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getCurrentUser(@CurrentUser() user) {
    return user;
  }

  @Post()
  async join(@Body() body: JoinRequestDto) {
    return await this.usersService.join(body);
  }

  @UseGuards(LocalAuthGuard)
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
