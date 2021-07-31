import { IsNotEmpty } from 'class-validator';

export class CreateAccountDTO {
  userId: number;

  @IsNotEmpty()
  accountName: string;

  @IsNotEmpty()
  accountNumber: number;

  @IsNotEmpty()
  accessKey: string;

  @IsNotEmpty()
  secretKey: string;
}
