import { Module } from "@nestjs/common";

import { UsecaseContainer } from "@logements/src/transformation/application-service";
import { Configuration, ConfigurationFactory } from "@logements/src/transformation/configuration/configuration";
import { GatewayContainerFactory } from "@logements/src/transformation/configuration/gateway.container";
import { UsecasesContainerFactory } from "@logements/src/transformation/configuration/usecases.container";
import {
	TransformFlowImmojeuneTask,
} from "@logements/src/transformation/infrastructure/tasks/transform-flow-immojeune.task";
import {
	TransformFlowStudapartTask,
} from "@logements/src/transformation/infrastructure/tasks/transform-flow-studapart.task";

import { SousModule } from "@shared/src/configuration/module";

@Module({
	providers: [{
		provide: TransformFlowImmojeuneTask,
		useValue: Transformation.export()["immojeune"],
	}, {
		provide: TransformFlowStudapartTask,
		useValue: Transformation.export()["studapart"],
	}],
	exports: [TransformFlowImmojeuneTask, TransformFlowStudapartTask],
})
export class Transformation {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const gateways = GatewayContainerFactory.create(configuration);
		const usecases = UsecasesContainerFactory.create(gateways);
		return Transformation.create(configuration, usecases);
	}

	private static create(configuration: Configuration, useCases: UsecaseContainer): SousModule {
		return {
			immojeune: new TransformFlowImmojeuneTask(useCases.transformerFluxImmojeune, configuration),
			studapart: new TransformFlowStudapartTask(useCases.transformerFluxStudapart, configuration),
		};
	}
}
