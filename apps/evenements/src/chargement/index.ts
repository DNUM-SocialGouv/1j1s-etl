import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import {
	ChargerFluxTousMobilises,
} from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import { Usecases } from "@evenements/src/chargement/configuration/usecases.container";
import { LoadTousMobilisesTask } from "@evenements/src/chargement/infrastructure/tasks/load-tous-mobilises.task";

@Module({
	imports: [ConfigModule, Usecases],
	providers: [{
		provide: LoadTousMobilisesTask,
		inject: [ConfigService, ChargerFluxTousMobilises],
		useFactory: (configurationService: ConfigService, usecase: ChargerFluxTousMobilises): LoadTousMobilisesTask => {
			return new LoadTousMobilisesTask(usecase, {
				MINIO: configurationService.get("MINIO"),
				TOUS_MOBILISES: configurationService.get("TOUS_MOBILISES"),
				STRAPI: configurationService.get("STRAPI"),
				FEATURE_FLIPPING_CHARGEMENT: configurationService.get("FEATURE_FLIPPING_CHARGEMENT"),
				CONTEXT: configurationService.get("CONTEXT"),
				SENTRY: configurationService.get("SENTRY"),
				NODE_ENV: configurationService.get("NODE_ENV"),
				DOMAINE: configurationService.get("DOMAINE"),
				FLOWS: configurationService.get("FLOWS"),
				TEMPORARY_DIRECTORY_PATH: configurationService.get("TEMPORARY_DIRECTORY_PATH"),
				LOGGER_LOG_LEVEL: configurationService.get("LOGGER_LOG_LEVEL"),
			});
		},
	}],
	exports: [LoadTousMobilisesTask],
})
export class Chargement {
}
