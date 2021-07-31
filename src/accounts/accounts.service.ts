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

  async create(user: User, createAccountDTO: CreateAccountDTO) {
    const account = new Account();
    account.accountName = createAccountDTO.accountName;
    account.accountNumber = createAccountDTO.accountNumber;
    account.accessKey = createAccountDTO.accessKey;
    account.secretKey = createAccountDTO.secretKey;
    account.user = user;
    await this.accountRepository.save(account);
  }

  async update(id, createAccountDTO: CreateAccountDTO) {
    await this.accountRepository.save({ ...createAccountDTO, id });
  }

  async remove(accountid) {
    await this.accountRepository.findOneOrFail(accountid);
    return this.accountRepository.delete(accountid);
  }
}
