import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
  constructor() {}

  @Get(':id/accounts/:accountid')
  getAccount(@Param() param) {
    console.log(param.id);
  }

  @Get('/all/accounts')
  getAllAccounts() {}

  @Post(':userid/accounts/:accountid')
  addAccount(@Body body: ) {}

  @Post()
  editAccount() {}

  @Delete(':userid/accounts/:accountid')
  deleteAccounts() {}
}
