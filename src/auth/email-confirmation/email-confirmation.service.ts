import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Request } from 'express'
import { Model } from 'mongoose'
import { MailService } from 'src/libs/mail/mail.service'
import { Token, TokenType } from 'src/schemas/token.schema'
import { User } from 'src/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import { v4 as uuidv4 } from 'uuid'

import { AuthService } from '../auth.service'

import { ConfirmationDto } from './dto/confirmation.dto'

@Injectable()
export class EmailConfirmationService {
	constructor(
		@InjectModel(Token.name) private tokenModel: Model<Token>,
		readonly mailService: MailService,
		readonly userService: UsersService,
		@Inject(forwardRef(() => AuthService))
		readonly authService: AuthService
	) {}

	async newVerification(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.tokenModel.findOne({
			token: dto.token,
			type: TokenType.Verification
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения'
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
			isVerified: true
		})

		await this.tokenModel.deleteOne({
			_id: existingToken.id,
			type: TokenType.Verification
		})

		return this.authService.saveSession(req, existingUser)
	}

	async sendVerificationToken(user: User) {
		const verificationToken = await this.generateVereficationToken(
			user.email
		)

		await this.mailService.sendConfirmationEmail(
			verificationToken.email,
			verificationToken.token
		)

		return true
	}

	private async generateVereficationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.tokenModel.findOne({
			email,
			type: TokenType.Verification
		})

		if (existingToken) {
			await this.tokenModel.deleteOne({
				_id: existingToken.id,
				type: TokenType.Verification
			})
		}

		const verificationToken = await this.tokenModel.create({
			email,
			token,
			expiresIn,
			type: TokenType.Verification
		})

		return verificationToken
	}
}
