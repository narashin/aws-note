import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('accounts')
export class AccountsController {
  constructor() {}

  @Get(':userid/accounts/:accountid')
  getAccount(@Param() param) {
    console.log(param.id);
  }

  @Get('/all/accounts')
  getAllAccounts() {}

  @Post(':userid/accounts/:accountid')
  addAccount(@Body() body) {}

  @Put()
  editAccount() {}

  @Delete(':userid/accounts/:accountid')
  deleteAccounts() {}
}
