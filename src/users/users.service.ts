import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/schemas/user.schema'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user-dto'

export interface IUser extends User {
	id: string
}

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async findById(id: string) {
		// const user = await this.userModel.findById(id).populate({
		// 	path: 'accounts'
		// })
		const user = await this.userModel.findById(id)

		if (!user) {
			throw new NotFoundException(
				'Пользователь не найден. Пожалуйста, проверьте введенные данные'
			)
		}

		return user
	}

	async findByEmail(email: string) {
		const user = await this.userModel.findOne({ email })

		return user
	}

	async create(dto: CreateUserDto) {
		const user = await this.userModel.create(dto)
		console.log(user)
		return user
	}

	async findByIdAndUpdate(id: string, dto: Partial<CreateUserDto>) {
		const updatedUser = await this.userModel.findByIdAndUpdate(id, {
			...dto
		})

		return updatedUser
	}

	async updateUser(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		const updatedUser = await this.userModel.findByIdAndUpdate(user.id, {
			...dto
		})

		return updatedUser
	}
}
