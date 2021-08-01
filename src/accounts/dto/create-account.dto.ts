import { IsNotEmpty } from 'class-validator';

export class CreateAccountDTO {
  userId: number;

  @IsNotEmpty()
  accountName: string;

  @IsNotEmpty()
  accountNumber: number;

  @IsNotEmpty()
  region: string;

  @IsNotEmpty()
  accessKey: string;

  @IsNotEmpty()
  secretKey: string;
}
