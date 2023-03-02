import { FluxExtraction } from "@logements/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@logements/src/extraction/domain/service/extraire-flux.domain-service";

import { Usecase } from "@shared/src/application-service/usecase";

export class ExtraireStudapart implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer(flux: Readonly<FluxExtraction>): Promise<void> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
