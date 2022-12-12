import { ExtraireFluxDomainService } from "@logements/extraction/domain/services/extraire-flux.domain-service";
import { FluxExtraction } from "@logements/extraction/domain/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireStudapartUseCase implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer(flux: Readonly<FluxExtraction>): Promise<void> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
