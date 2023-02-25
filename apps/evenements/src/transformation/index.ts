import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import { Configuration, ConfigurationFactory } from "@evenements/src/transformation/configuration/configuration";
import { Usecases } from "@evenements/src/transformation/configuration/usecases.container";
import {
	TransformFlowTousMobilisesTask,
} from "@evenements/src/transformation/infrastructure/tasks/transform-flow-tous-mobilises.task";

@Module({
	imports: [
		ConfigModule.forRoot({ load: [ConfigurationFactory.createRoot] }),
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
				configurationService.get<Configuration>("evenementsTransformation"),
			);
		},
	}],
	exports: [TransformFlowTousMobilisesTask],
})
export class Transformation {
}
