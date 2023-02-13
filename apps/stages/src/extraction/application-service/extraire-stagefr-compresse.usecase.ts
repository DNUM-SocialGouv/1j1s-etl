import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { Usecase } from "@shared/src/usecase";

export class ExtraireStagefrCompresse implements Usecase {
	constructor(private readonly extraireFlux: ExtraireFluxDomainService) {
	}

	public executer(flux: FluxExtraction): Promise<void> {
		return this.extraireFlux.extraire(flux);
	}
}
