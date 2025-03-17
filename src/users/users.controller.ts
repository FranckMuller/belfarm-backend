import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { UserRole } from 'src/schemas/user.schema'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user-dto'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get()
	findAll() {
		return []
	}

	@Post()
	create(@Body() dto: CreateUserDto) {
		return this.usersService.create(dto)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	async findProfile(@Authorized('id') userId: string) {
		return this.usersService.findById(userId)
	}

	@Authorization(UserRole.Admin)
	@Get('by-id/:id')
	@HttpCode(HttpStatus.OK)
	async findById(@Param('id') id: string) {
		return this.usersService.findById(id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch('profile')
	async updateProfile(
		@Body() dto: UpdateUserDto,
		@Authorized('id') id: string
	) {
		return this.usersService.updateUser(id, dto)
	}
}
