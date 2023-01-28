import { Configuration, ConfigurationFactory } from "@logements/transformation/configuration/configuration";
import { GatewayContainerFactory } from "@logements/transformation/configuration/gateway.container";
import { SousModule } from "@shared/configuration/module";
import {
	TransformFluxImmojeuneTask,
} from "@logements/transformation/infrastructure/tasks/transform-flux-immojeune.task";
import {
	TransformFluxStudapartTask,
} from "@logements/transformation/infrastructure/tasks/transform-flux-studapart.task";
import { UsecaseContainer } from "@logements/transformation/application-service";
import { UsecasesContainerFactory } from "@logements/transformation/configuration/usecases.container";

export class Transformation {
	public static export(): SousModule {
		const configuration = ConfigurationFactory.create();
		const gateways = GatewayContainerFactory.create(configuration);
		const usecases = UsecasesContainerFactory.create(gateways);
		return Transformation.create(configuration, usecases);
	}

	private static create(configuration: Configuration, useCases: UsecaseContainer): SousModule {
		return {
			immojeune: new TransformFluxImmojeuneTask(useCases.transformerFluxImmojeune, configuration),
			studapart: new TransformFluxStudapartTask(useCases.transformerFluxStudapart, configuration),
		};
	}
}
