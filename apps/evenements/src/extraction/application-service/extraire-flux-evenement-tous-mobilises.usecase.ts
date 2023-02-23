import { FluxExtraction } from "@evenements/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@evenements/src/extraction/domain/service/extraire-flux.domain-service";

import { Usecase } from "@shared/src/usecase";

export class ExtraireFluxEvenementTousMobilises implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer<T>(flux: Readonly<FluxExtraction>): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
