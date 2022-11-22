import { ExtraireFluxDomainService } from "@evenements/extraction/domain/services/extraire-flux.domain-service";
import { FluxExtraction } from "@evenements/extraction/domain/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireEvenementTousMobilisesUsecase implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer<T>(flux: Readonly<FluxExtraction>): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
