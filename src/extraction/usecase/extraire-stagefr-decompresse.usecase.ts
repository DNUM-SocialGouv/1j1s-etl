import { ConfigurationFlux } from "@extraction/domain/configuration-flux";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { Usecase } from "@extraction/usecase/usecase";

export class ExtraireStagefrDecompresse implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	executer<T>(configurationFlux: Readonly<ConfigurationFlux>): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(configurationFlux);
	}
}
