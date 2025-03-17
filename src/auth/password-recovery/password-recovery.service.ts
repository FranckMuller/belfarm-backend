import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'argon2'
import { Model } from 'mongoose'
import { MailService } from 'src/libs/mail/mail.service'
import { Token, TokenType } from 'src/schemas/token.schema'
import { UsersService } from 'src/users/users.service'
import { v4 as uuidv4 } from 'uuid'

import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class PasswordRecoveryService {
	constructor(
		readonly userService: UsersService,
		readonly mailService: MailService,
		@InjectModel(Token.name) private tokenModel: Model<Token>
	) {}

	async resetPassword(dto: ResetPasswordDto) {
		const existingUser = await this.userService.findByEmail(dto.email)

		if (!existingUser) {
			throw new NotFoundException(
				'Пользователь не найдет. Пожалуйста, проверьте введеный адрес электронной почты и попробуйте снова.'
			)
		}

		const passwordResetToken = await this.generatePasswordResetToken(
			existingUser.email
		)

		await this.mailService.sendPasswordResetEmail(
			passwordResetToken.email,
			passwordResetToken.token
		)

		return true
	}

	async newPassword(dto: NewPasswordDto, token: string) {
		const existingToken = await this.tokenModel.findOne({
			token,
			type: TokenType.PasswordReset
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Токен не найден. Пожалуйста, проверьте правильность введенного токена или запросите новый.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				'Токен истек. Пожалуйста, запросите новый токен для подтверждения сброса пароля'
			)
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)

		if (!existingUser) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенный адрес электронной почты и попробуйте снова.'
			)
		}

		await this.userService.findByIdAndUpdate(existingUser.id, {
			password: await hash(dto.password)
		})

		await this.tokenModel.findOneAndDelete({
			_id: existingToken.id,
			type: TokenType.PasswordReset
		})

		return true
	}

	private async generatePasswordResetToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.tokenModel.findOne({
			email,
			type: TokenType.PasswordReset
		})

		if (existingToken) {
			await this.tokenModel.deleteOne({
				_id: existingToken.id,
				type: TokenType.PasswordReset
			})
		}

		const passwordResetToken = await this.tokenModel.create({
			email,
			token,
			expiresIn,
			type: TokenType.PasswordReset
		})

		return passwordResetToken
	}
}
