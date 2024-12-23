import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { hash } from 'argon2'
import mongoose, { HydratedDocument } from 'mongoose'

import { Account } from './account.schema'

export type UserDocument = HydratedDocument<User>

export enum UserRole {
	User = 'USER',
	Admin = 'ADMIN'
}

export enum AuthMethod {
	Credintials = 'CREDENTIALS',
	Google = 'GOOGLE',
	Yandex = 'YANDEX'
}

@Schema({ timestamps: true })
export class User {
	@Prop()
	name: string

	@Prop()
	email: string

	@Prop()
	password: string

	@Prop()
	avatar?: string

	@Prop({ default: false })
	isVerified: boolean

	@Prop({ default: false })
	isTwoFactorEnabled: boolean

	@Prop({ default: UserRole.User })
	role: UserRole

	@Prop()
	method: AuthMethod

	@Prop({
		type: [{ type: mongoose.Schema.ObjectId, ref: (() => Account).name }]
	})
	accounts: Account[]
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
	const user = this as UserDocument
	if (user.password && user.isModified('password')) {
		user.password = await hash(user.password)
	} else if (!user.password) {
		user.password = ''
	}
	next()
})

UserSchema.set('toJSON', {
	virtuals: true,
	transform: (_, ret) => {
		delete ret.__v
		ret.id = ret._id.toString()
		delete ret._id
	}
})

export { UserSchema }
