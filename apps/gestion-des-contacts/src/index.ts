import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@gestion-des-contacts/src/application-service";
import {
	EnvoyerLesContactsCejAPoleEmploi,
} from "@gestion-des-contacts/src/application-service/envoyer-les-contacts-cej-a-pole-emploi.usecase";
import {
	Configuration,
	ConfigurationFactory,
} from "@gestion-des-contacts/src/infrastructure/configuration/configuration";
import {
	SendContactCejToPoleEmploiSubCommand,
} from "@gestion-des-contacts/src/infrastructure/sub-command/send-contact-cej-to-pole-emploi.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [{
		provide: SendContactCejToPoleEmploiSubCommand,
		inject: [ConfigService, EnvoyerLesContactsCejAPoleEmploi],
		useFactory: (configurationService: ConfigService, usecase: EnvoyerLesContactsCejAPoleEmploi): SendContactCejToPoleEmploiSubCommand => {
			const isFeatureFlipped = configurationService.get<Configuration>("gestionDesContacts").CONTACTS_CEJ.FEATURE_FLIPPING;
			return isFeatureFlipped
				? new SendContactCejToPoleEmploiSubCommand({ executer: () => Promise.resolve() })
				: new SendContactCejToPoleEmploiSubCommand(usecase);
		},
	}],
	exports: [SendContactCejToPoleEmploiSubCommand],
})
export class GestionDesContacts {
}
