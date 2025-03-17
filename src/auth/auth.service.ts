import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { verify } from 'argon2'
import { Request, Response } from 'express'
import { Model } from 'mongoose'
import { Account } from 'src/schemas/account.schema'
import { AuthMethod, UserDocument } from 'src/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { ProviderService } from './provider/provider.service'

@Injectable()
export class AuthService {
	constructor(
		readonly usersService: UsersService,
		readonly configService: ConfigService,
		readonly providerService: ProviderService,
		readonly emailConfirmationService: EmailConfirmationService,
		@InjectModel(Account.name) private accountService: Model<Account>
	) {}

	async register(req: Request, dto: RegisterDto) {
		const isExists = await this.usersService.findByEmail(dto.email)
		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась, пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.'
			)
		}

		const newUser = await this.usersService.create(dto)

		// await this.emailConfirmationService.sendVerificationToken(newUser)
		console.log(newUser)
		return this.saveSession(req, newUser)

		return {
			message:
				'Вы успешно зарегестрировались. Пожалуйста, подтвердите ваш email. Сообщение было отправлено на ваш почтовый адрес.'
		}
	}

	async login(req: Request, dto: LoginDto) {
		const user = await this.usersService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенные данные'
			)
		}

		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Неверный email или пароль. Пожалуйста попробуйте еще раз или восстановите пароль, если вы забыли его.'
			)
		}

		// if (!user.isVerified) {
		// 	await this.emailConfirmationService.sendVerificationToken(user)
		// 	throw new UnauthorizedException(
		// 		'Ваш email не подтвержден. Пожалуйста, проверье вашу почту и подтвердите адрес.'
		// 	)
		// }

		return this.saveSession(req, user)
	}

	async extractProfileFromCode(req: Request, provider: string, code: string) {
		const providerInstance = this.providerService.findByService(provider)
		const profile = await providerInstance.findUserByCode(code)

		const account = await this.accountService.findOne({
			id: profile.id,
			provider: profile.provider
		})

		let user = account?.user
			? await this.usersService.findById(account.user)
			: null

		if (user) {
			return this.saveSession(req, user)
		}

		user = await this.usersService.create({
			email: profile.email,
			password: '',
			name: profile.name,
			method: AuthMethod[profile.provider.toUpperCase()],
			isVerified: true
		})

		if (!account) {
			await this.accountService.create({
				user: user.id,
				type: 'oauth',
				provider: profile.provider,
				accessToken: profile.access_token,
				refreshToken: profile.refresh_token,
				expiresAt: profile.expires_at
			})
		}

		return this.saveSession(req, user)
	}

	async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию. Возможно овзникла проблема с серверои или сессия уже была завершена'
						)
					)
				}

				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	async saveSession(req: Request, user: UserDocument) {
		return new Promise((resolve, reject) => {
			console.log(user)
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию. Проверьте, правильно ли настроен параметры сесии'
						)
					)
				}

				resolve({
					user
				})
			})
		})
	}
}
