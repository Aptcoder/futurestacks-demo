import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserRole)
  role: string;
}
