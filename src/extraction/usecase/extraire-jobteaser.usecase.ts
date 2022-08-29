import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { Flux } from "@extraction/domain/flux";
import { Usecase } from "@shared/usecase";

export class ExtraireJobteaser implements Usecase {
	constructor(private readonly extraireFluxDomainService: ExtraireFluxDomainService) {
	}

	executer<T>(flux: Readonly<Flux>): Promise<void | T> {
		return this.extraireFluxDomainService.extraire(flux);
	}
}
