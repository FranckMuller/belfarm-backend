import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(readonly usersService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException(
				'Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.'
			)
		}

		const user = await this.usersService.findById(request.session.userId)

		request.user = user

		return true
	}
}
