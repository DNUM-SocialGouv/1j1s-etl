import { Flux } from "@extraction/domain/flux";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { Usecase } from "@shared/usecase";


export class ExtraireHelloWork implements Usecase {

	constructor(private readonly extraireFluxDomaineService: ExtraireFluxDomainService){}

	executer<T>(flux: Readonly<Flux>): Promise<void | T> {
		return this.extraireFluxDomaineService.extraire(flux);
	}

}