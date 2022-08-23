import { Usecase } from "@extraction/usecase/usecase";
import { ConfigurationFlux } from "@extraction/domain/configuration-flux";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";

export class ExtraireStagefrCompresse implements Usecase {
	constructor(private readonly extraireFlux: ExtraireFluxDomainService) {
	}

	executer(configurationFlux: ConfigurationFlux): Promise<void> {
		return this.extraireFlux.extraire(configurationFlux);
	}
}
