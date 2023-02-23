import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Environment, SentryConfiguration } from "@configuration/src/configuration";

import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import {
	ConfigurationFactory,
	MinioConfiguration,
	TaskConfiguration,
} from "@evenements/src/transformation/configuration/configuration";
import { Usecases } from "@evenements/src/transformation/configuration/usecases.container";
import {
	TransformFlowTousMobilisesTask,
} from "@evenements/src/transformation/infrastructure/tasks/transform-flow-tous-mobilises.task";

import { Domaine, LogLevel } from "@shared/src/configuration/logger";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.create] }),
		Usecases,
	],
	providers: [{
		provide: TransformFlowTousMobilisesTask,
		inject: [ConfigService, TransformerFluxTousMobilises],
		useFactory: (
			configurationService: ConfigService,
			transformerFluxTousMobilises: TransformerFluxTousMobilises
		): TransformFlowTousMobilisesTask => {
			return new TransformFlowTousMobilisesTask(
				transformerFluxTousMobilises,
				{
					CONTEXT: configurationService.get<string>("CONTEXT"),
					DOMAINE: configurationService.get<Domaine>("DOMAINE"),
					FLOWS: configurationService.get<Array<Domaine>>("FLOWS"),
					LOGGER_LOG_LEVEL: configurationService.get<LogLevel>("LOGGER_LOG_LEVEL"),
					MINIO: configurationService.get<MinioConfiguration>("MINIO"),
					NODE_ENV: configurationService.get<Environment>("NODE_ENV"),
					SENTRY: configurationService.get<SentryConfiguration>("SENTRY"),
					TEMPORARY_DIRECTORY_PATH: configurationService.get<string>("TEMPORARY_DIRECTORY_PATH"),
					TOUS_MOBILISES: configurationService.get<TaskConfiguration>("TOUS_MOBILISES"),
				},
			);
		},
	}],
	exports: [TransformFlowTousMobilisesTask],
})
export class Transformation {
}
