import { Module } from "@nestjs/common";

import {
	EnvoyerLesContactsCejAPoleEmploi,
} from "@gestion-des-contacts/src/application-service/envoyer-les-contacts-cej-a-pole-emploi.usecase";
import {
	EnvoyerLesContactsPoeAPoleEmploi,
} from "@gestion-des-contacts/src/application-service/envoyer-les-contacts-poe-a-pole-emploi.usecase";
import { ContactCejRepository } from "@gestion-des-contacts/src/domain/service/contact-cej.repository";
import { ContactPoeRepository } from "@gestion-des-contacts/src/domain/service/contact-poe.repository";
import { Gateways } from "@gestion-des-contacts/src/infrastructure/gateway";

@Module({
	imports: [Gateways],
	providers: [
		{
			provide: EnvoyerLesContactsCejAPoleEmploi,
			inject: ["ContactCejRepository"],
			useFactory: (contactCejRepository: ContactCejRepository): EnvoyerLesContactsCejAPoleEmploi => {
				return new EnvoyerLesContactsCejAPoleEmploi(contactCejRepository);
			},
		},
		{
			provide: EnvoyerLesContactsPoeAPoleEmploi,
			inject: ["ContactPoeRepository"],
			useFactory: (contactPoeRepository: ContactPoeRepository): EnvoyerLesContactsPoeAPoleEmploi => {
				return new EnvoyerLesContactsPoeAPoleEmploi(contactPoeRepository);
			},
		},
	],
	exports: [EnvoyerLesContactsCejAPoleEmploi, EnvoyerLesContactsPoeAPoleEmploi],
})
export class Usecases {
}
