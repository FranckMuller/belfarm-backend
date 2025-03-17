import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { Resend } from 'resend'

import { ConfirmationTemplate } from './templates/confirmation.template'
import { ResetPasswordTemplate } from './templates/reset-password.template'

const resend = new Resend('re_aVUg28oi_92VrfWomRA1d29d8Utt3urUP')

@Injectable()
export class MailService {
	constructor(
		readonly mailerService: MailerService,
		readonly configService: ConfigService
	) {}

	async sendConfirmationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html = await render(ConfirmationTemplate({ domain, token }))

		return this.sendEmail(email, 'Подтверждение почты', html)
	}

	async sendPasswordResetEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html = await render(ResetPasswordTemplate({ domain, token }))

		return this.sendEmail(email, 'Сброс пароля', html)
	}

	async sendEmail(email: string, subject: string, html: string) {
		const { data, error } = await resend.emails.send({
			from: 'Belfarm Team <onboarding@resend.dev>',
			to: email,
			subject,
			html
		})

		return { data, error }
	}
}
