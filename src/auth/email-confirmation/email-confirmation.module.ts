import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MailModule } from 'src/libs/mail/mail.module'
import { MailService } from 'src/libs/mail/mail.service'
import { Token, TokenSchema } from 'src/schemas/token.schema'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'

import { AuthModule } from '../auth.module'

import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
	imports: [
		MailModule,
		UsersModule,
		forwardRef(() => AuthModule),
		MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])
	],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, UsersService, MailService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
