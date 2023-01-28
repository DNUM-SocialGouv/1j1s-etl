import { ExtraireFluxDomainService } from "@logements/extraction/domain/service/extraire-flux.domain-service";
import { FluxExtraction } from "@logements/extraction/domain/model/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireStudapart implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer(flux: Readonly<FluxExtraction>): Promise<void> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
