import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'картофель' })
  @IsNotEmpty({ message: 'Введите название продукта' })
  name: string;

  @ApiProperty({ example: 'картофель с домашнего подворья' })
  @IsNotEmpty({ message: 'Введите описание продукта' })
  description: string;

  @ApiProperty({ example: '13' })
  @IsNotEmpty({ message: 'Введите цену продукта' })
  price: string;
}
