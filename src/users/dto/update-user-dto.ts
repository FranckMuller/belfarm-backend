import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class UpdateUserDto {
	@ApiProperty({ example: 'Иван' })
	@IsNotEmpty({ message: 'Введите имя' })
	name: string

	@ApiProperty({ example: 'example@mail.ru' })
	@IsEmail({}, { message: 'Некорректный формат email' })
	@IsNotEmpty({ message: 'Введите ваш email' })
	email: string
}
