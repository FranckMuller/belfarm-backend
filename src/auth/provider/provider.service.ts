import { Inject, Injectable } from '@nestjs/common'

import { ProviderOptionsSymbol, TypeOptions } from './providers.constants'
import { BaseOAuthService } from './services/base-oauth.service'

@Injectable()
export class ProviderService {
	constructor(@Inject(ProviderOptionsSymbol) readonly options: TypeOptions) {}

	onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	findByService(service: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === service)
	}
}
