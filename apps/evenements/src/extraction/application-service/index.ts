import { Module } from "@nestjs/common";

import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import { ExtraireFluxDomainService } from "@evenements/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxRepository } from "@evenements/src/extraction/domain/service/flux.repository";
import { Gateways } from "@evenements/src/extraction/infrastructure/gateway";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";

@Module({
	imports: [Gateways, Shared],
	providers: [{
		provide: ExtraireFluxDomainService,
		inject: ["FluxRepository", DateService],
		useFactory: (fluxRepository: FluxRepository, dateService: DateService): ExtraireFluxDomainService => {
			return new ExtraireFluxDomainService(fluxRepository, dateService);
		},
	}, {
		provide: ExtraireFluxEvenementTousMobilises,
		inject: [ExtraireFluxDomainService],
		useFactory: (extraireFluxDomainService: ExtraireFluxDomainService): ExtraireFluxEvenementTousMobilises => {
			return new ExtraireFluxEvenementTousMobilises(extraireFluxDomainService);
		},
	}],
	exports: [ExtraireFluxEvenementTousMobilises],
})
export class Usecases {
}
