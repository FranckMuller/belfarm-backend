import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { getProvidersConfig } from 'src/config/providers.config'
import { getReacaptchaConfig } from 'src/config/reacaptcha.config'
import { MailService } from 'src/libs/mail/mail.service'
import { Account, AccountSchema } from 'src/schemas/account.schema'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { ProviderModule } from './provider/provider.module'

@Module({
	imports: [
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getReacaptchaConfig,
			inject: [ConfigService]
		}),
		MongooseModule.forFeature([
			{ name: Account.name, schema: AccountSchema }
		]),
		UsersModule,
		forwardRef(() => EmailConfirmationModule)
	],
	providers: [AuthService, UsersService, MailService],
	controllers: [AuthController],
	exports: [AuthService]
})
export class AuthModule {}
