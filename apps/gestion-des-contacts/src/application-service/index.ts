import { Module } from "@nestjs/common";

import {
	EnvoyerLesContactsCejAPoleEmploi,
} from "@gestion-des-contacts/src/application-service/envoyer-les-contacts-cej-a-pole-emploi.usecase";
import { ContactCejRepository } from "@gestion-des-contacts/src/domain/service/contact-cej.repository";
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
	],
	exports: [EnvoyerLesContactsCejAPoleEmploi],
})
export class Usecases {
}
