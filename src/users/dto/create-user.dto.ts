import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { AuthMethod } from 'src/schemas/user.schema'

export class CreateUserDto {
	@ApiProperty({ example: 'Иван' })
	@IsNotEmpty({ message: 'Введите имя' })
	name: string

	@ApiProperty({ example: 'example@mail.ru' })
	@IsNotEmpty({ message: 'Введите ваш email' })
	email: string

	@ApiProperty({ example: '1234' })
	password?: string

	@ApiProperty({ example: 'avatar.jpg' })
	avatar?: string

	@ApiProperty()
	method?: AuthMethod

	@ApiProperty()
	isVerified?: boolean
}
