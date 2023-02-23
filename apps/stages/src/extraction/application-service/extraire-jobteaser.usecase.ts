import { Usecase } from "@shared/src/usecase";

import { FluxExtraction } from "@stages/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";

export class ExtraireJobteaser implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer<T>(flux: Readonly<FluxExtraction>): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
