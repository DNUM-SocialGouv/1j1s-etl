import { ExtraireFluxDomainService } from "@evenements/extraction/domain/service/extraire-flux.domain-service";
import { FluxExtraction } from "@evenements/extraction/domain/model/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireFluxEvenementTousMobilises implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer<T>(flux: Readonly<FluxExtraction>): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
