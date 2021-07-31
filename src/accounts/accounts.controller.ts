import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDTO } from './dto/create-account.dto';
import { UsersService } from '../users/users.service';
import { UseGuards, Delete } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

// @UseGuards(LocalAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountService: AccountsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/all/')
  findAll(@Param() param) {
    return this.accountService.findAll();
  }

  @Get('/:accountId')
  findOne(@Param('accountid') accountid: number) {
    return this.accountService.findAccountById(accountid);
  }

  @Post()
  async create(@Body() createAccountDto: CreateAccountDTO) {
    const user = await this.usersService.findById(createAccountDto.userId);
    await this.accountService.create(user, createAccountDto);
  }

  @Put('/:accountId')
  update(
    @Param('accountid') accountid: number,
    createAccountDTO: CreateAccountDTO,
  ) {
    return this.accountService.update({ id: accountid }, createAccountDTO);
  }

  @Delete('/:accountId')
  remove(@Param('accountid') accountid: number) {
    return this.accountService.remove(accountid);
  }
}
