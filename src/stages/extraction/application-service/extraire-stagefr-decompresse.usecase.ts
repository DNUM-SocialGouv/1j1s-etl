import { ExtraireFluxDomainService } from "@stages/extraction/domain/service/extraire-flux.domain-service";
import { FluxExtraction } from "@stages/extraction/domain/model/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireStagefrDecompresse implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer<T>(flux: FluxExtraction): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}