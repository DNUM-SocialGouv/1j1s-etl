import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { Usecases } from "@evenements/src/transformation/application-service";
import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import {
	Configuration,
	ConfigurationFactory,
} from "@evenements/src/transformation/infrastructure/configuration/configuration";
import {
	TransformFlowTousMobilisesSubCommand,
} from "@evenements/src/transformation/infrastructure/sub-command/transform-flow-tous-mobilises.sub-command";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationFactory.createRoot],
			envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
		}),
		Usecases,
	],
	providers: [{
		provide: TransformFlowTousMobilisesSubCommand,
		inject: [ConfigService, TransformerFluxTousMobilises],
		useFactory: (
			configurationService: ConfigService,
			transformerFluxTousMobilises: TransformerFluxTousMobilises
		): TransformFlowTousMobilisesSubCommand => {
			return new TransformFlowTousMobilisesSubCommand(
				transformerFluxTousMobilises,
				configurationService.get<Configuration>("evenementsTransformation"),
			);
		},
	}],
	exports: [TransformFlowTousMobilisesSubCommand],
})
export class Transformation {
}
