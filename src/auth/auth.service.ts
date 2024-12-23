import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import { Request, Response } from 'express'
import { UserDocument } from 'src/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	constructor(
		readonly usersService: UsersService,
		readonly configService: ConfigService
	) {}

	async register(req: Request, dto: RegisterDto) {
		console.log(dto)
		const isExists = await this.usersService.findByEmail(dto.email)
		if (isExists) {
			throw new ConflictException(
				'Регистрация не удалась, пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.'
			)
		}

		const newUser = await this.usersService.create(dto)

		return this.saveSession(req, newUser)
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

	private async saveSession(req: Request, user: UserDocument) {
		return new Promise((resolve, reject) => {
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
