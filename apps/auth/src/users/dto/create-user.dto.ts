import { RoleDto } from '@app/common/dto';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  roles?: RoleDto[];
}
