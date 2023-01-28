import { ExtraireFluxDomainService } from "@logements/extraction/domain/service/extraire-flux.domain-service";
import { FluxExtraction } from "@logements/extraction/domain/model/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireImmojeune implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	public executer<T>(flux: Readonly<FluxExtraction>): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
