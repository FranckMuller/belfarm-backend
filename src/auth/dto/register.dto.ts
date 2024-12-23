import { ApiProperty } from '@nestjs/swagger'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'
import { IsPasswordMatchingConstraint } from 'src/libs/common/decorators/Is-password-matching-constraint.decorator'

export class RegisterDto {
	@ApiProperty({ example: 'Иван' })
	@IsString({ message: 'Имя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения' })
	name: string

	@ApiProperty({ example: 'example@mail.ru' })
	@IsString({ message: 'Email должно быть строкой.' })
	@IsEmail({}, { message: 'Некорректный формат email' })
	@IsNotEmpty({ message: 'Email обязателен для заполнения' })
	email: string

	@ApiProperty({ example: '123456' })
	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
	@MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
	password: string

	@ApiProperty({ example: '123456' })
	@IsString({ message: 'Пароль подтверждения должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль подтверждения обязателен для заполнения' })
	@MinLength(6, {
		message: 'Пароль подтверждения должен содержать минимум 6 символов'
	})
	@Validate(IsPasswordMatchingConstraint, { message: 'Пароли не совпадают' })
	passwordRepeat: string
}
