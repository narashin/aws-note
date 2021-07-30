import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Account } from 'src/entities/account.entity';
import { User } from 'src/entities/user.entity';
dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOSTNAME,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Account],
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
};

export default config;
