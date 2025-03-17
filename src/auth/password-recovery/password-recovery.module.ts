import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MailModule } from 'src/libs/mail/mail.module'
import { Token, TokenSchema } from 'src/schemas/token.schema'
import { UsersModule } from 'src/users/users.module'

import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	imports: [
		UsersModule,
		MailModule,
		MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])
	],
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
