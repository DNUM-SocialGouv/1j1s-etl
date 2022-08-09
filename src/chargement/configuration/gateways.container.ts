import { Configuration } from "@configuration/configuration";
import { GatewayContainer } from "@chargement/infrastructure/gateway";
import { UnJeune1Solution } from "@chargement/domain/1jeune1solution";

export class GatewayContainerFactory {
	static create(configuration: Configuration): GatewayContainer {
		return {
			offreDeStageRepository: {  } as UnJeune1Solution.OffreDeStageRepository,
		};
	}
}
