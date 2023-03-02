import { Usecase } from "@shared/src/application-service/usecase";

import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";

export class ExtraireStagefrCompresse implements Usecase {
	constructor(private readonly extraireFlux: ExtraireFluxDomainService) {
	}

	public executer(flux: FluxExtraction): Promise<void> {
		return this.extraireFlux.extraire(flux);
	}
}
