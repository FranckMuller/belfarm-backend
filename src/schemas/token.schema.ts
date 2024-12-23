import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TokenDocument = HydratedDocument<Token>

enum TokenType {
	Verification = 'VERIFICATION',
	TwoFactor = 'TWO_FACTOR',
	PasswordReset = 'PASSWORD_RESET'
}

@Schema()
export class Token {
	@Prop()
	email: string

	@Prop()
	token: string

	@Prop()
	type: TokenType

	@Prop()
	expiresIn: Date
}

const TokenSchema = SchemaFactory.createForClass(Token)

TokenSchema.set('toJSON', {
	virtuals: true,
	transform: (_, ret) => {
		delete ret.__v
		ret.id = ret._id.toString()
		delete ret._id
	}
})

export { TokenSchema }
