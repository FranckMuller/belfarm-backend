import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
	@ApiProperty({ example: 'dmitrysvetlov113@gmail.com' })
	@IsEmail({}, { message: 'Введите адрес электронной почты.' })
	@IsNotEmpty({ message: 'поле email не может быть пустым' })
	email: string
}
