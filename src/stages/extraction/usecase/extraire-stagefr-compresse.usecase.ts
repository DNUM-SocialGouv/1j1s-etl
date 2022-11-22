import { ExtraireFluxDomainService } from "@stages/extraction/domain/services/extraire-flux.domain-service";
import { FluxExtraction } from "@stages/extraction/domain/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireStagefrCompresse implements Usecase {
	constructor(private readonly extraireFlux: ExtraireFluxDomainService) {
	}

	public executer(flux: FluxExtraction): Promise<void> {
		return this.extraireFlux.extraire(flux);
	}
}
