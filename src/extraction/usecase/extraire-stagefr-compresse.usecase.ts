import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { Flux } from "@extraction/domain/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireStagefrCompresse implements Usecase {
	constructor(private readonly extraireFlux: ExtraireFluxDomainService) {
	}

	executer(flux: Flux): Promise<void> {
		return this.extraireFlux.extraire(flux);
	}
}
