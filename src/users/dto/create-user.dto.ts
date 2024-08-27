import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван' })
  @IsNotEmpty({ message: 'Введите имя' })
  name: string;

  @ApiProperty({ example: 'example@mail.ru' })
  @IsNotEmpty({ message: 'Введите ваш email' })
  email: string;
}
