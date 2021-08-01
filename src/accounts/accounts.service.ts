import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAccountDTO } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async findAccountById(accountid: number) {
    const account = await this.accountRepository.findOne({
      where: { accountid },
    });
    return account;
  }

  async findAll() {
    const account = await this.accountRepository.find({
      relations: ['user'],
    });
    return account;
  }

  async create(user: User, createAccountDto: CreateAccountDTO) {
    const account = new Account();
    account.accountName = createAccountDto.accountName;
    account.accountNumber = createAccountDto.accountNumber;
    account.accessKey = createAccountDto.accessKey;
    account.secretKey = createAccountDto.secretKey;
    account.user = user;
    await this.accountRepository.save(account);
  }

  async update(accountid, createAccountDto: CreateAccountDTO) {
    let account = await this.accountRepository.findOne(accountid);
    account.accountName = createAccountDto.accountName;
    account.accountNumber = createAccountDto.accountNumber;
    account.accessKey = createAccountDto.accessKey;
    account.secretKey = createAccountDto.secretKey;

    await this.accountRepository.save(account);
  }

  async remove(accountid) {
    const account = await this.accountRepository.findOne(accountid);
    await this.accountRepository.delete(account.id);
  }
}
