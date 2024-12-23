import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { RedisStore } from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import IORedis from 'ioredis'

import { AppModule } from './app.module'
import { corsOptions } from './config/cors.options'
import { ms, StringValue } from './libs/common/utils/ms.util'
import { parseBoolean } from './libs/common/utils/parse-boolean.util'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const appConfig = app.get(ConfigService)
	const redisPassword = appConfig.getOrThrow<string>('REDIS_PASSWORD')
	const redisHost = appConfig.getOrThrow<string>('REDIS_HOST')
	const redisPort = appConfig.getOrThrow<number>('REDIS_PORT')
	const redisUri = `redis://${redisHost}:${redisPort}`
	console.log(redisUri)
	const redis = new IORedis(redisUri, { password: redisPassword })

	app.use(cookieParser(appConfig.getOrThrow<string>('COOKIES_SECRET')))
	app.setGlobalPrefix('api')
	// app.enableCors(corsOptions)
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	app.use(
		session({
			secret: appConfig.getOrThrow<string>('SESSION_SECRET'),
			name: appConfig.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: appConfig.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(
					appConfig.getOrThrow<StringValue>('SESSION_MAX_AGE')
				),
				httpOnly: parseBoolean(
					appConfig.getOrThrow<StringValue>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					appConfig.getOrThrow<StringValue>('SESSION_SECURE')
				),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: redis,
				prefix: appConfig.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	app.enableCors({
		origin: appConfig.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	const config = new DocumentBuilder()
		.setTitle('belfarm API')
		.setDescription('The belfarm API description')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	await app.listen(appConfig.getOrThrow<number>('APPLICATION_PORT'))

	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
