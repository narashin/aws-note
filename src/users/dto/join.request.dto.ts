import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JoinRequestDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public password: string;
}
