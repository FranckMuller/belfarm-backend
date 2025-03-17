import { IsString } from 'class-validator'

export class ConfirmationDto {
	@IsString({ message: 'Токен должен быть строкой' })
	@IsString({ message: 'Поле токен не может быть пустым' })
	token: string
}
