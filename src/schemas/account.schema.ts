import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

import { User } from './user.schema'

export type AccountDocument = HydratedDocument<Account>

@Schema({ timestamps: true })
export class Account {
	@Prop()
	type: string

	@Prop()
	provider: string

	@Prop()
	refreshToken?: string

	@Prop()
	accessToken?: string

	@Prop()
	expiresAt?: number

	@Prop({ type: mongoose.Schema.ObjectId, ref: (() => User).name })
	user: string
}

const AccountSchema = SchemaFactory.createForClass(Account)

AccountSchema.set('toJSON', {
	virtuals: true,
	transform: (_, ret) => {
		delete ret.__v
		ret.id = ret._id.toString()
		delete ret._id
	}
})

export { AccountSchema }
