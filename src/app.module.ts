import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module'
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module'
import { ProviderModule } from './auth/provider/provider.module'
import { CategoriesModule } from './categories/categories.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module'
import { ProductsModule } from './products/product.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: !IS_DEV_ENV }),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads'),
			serveRoot: '/uploads/'
		}),
		MongooseModule.forRoot(process.env.DB_URL, {
			connectionFactory: connection => {
				connection.on('connected', () => {
					console.log('connected to mongoDB')
				})
				connection._events.connected()
				return connection
			}
		}),

		UsersModule,
		ProductsModule,
		CategoriesModule,
		AuthModule,
		ProviderModule,
		MailModule,
		EmailConfirmationModule,
		PasswordRecoveryModule
	],
	controllers: [],
	providers: [AppService, ProviderModule]
})
export class AppModule {}
