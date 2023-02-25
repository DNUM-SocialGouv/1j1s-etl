import { Module } from "@nestjs/common";

import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";
import { ExtraireFluxDomainService } from "@logements/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxRepository } from "@logements/src/extraction/domain/service/flux.repository";
import { Gateways } from "@logements/src/extraction/infrastructure/gateway";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/date.service";

@Module({
	imports: [Gateways, Shared],
	providers: [{
		provide: ExtraireFluxDomainService,
		inject: ["FluxRepository", DateService],
		useFactory: (fluxRepository: FluxRepository, dateService: DateService): ExtraireFluxDomainService => {
			return new ExtraireFluxDomainService(fluxRepository, dateService);
		},
	}, {
		provide: ExtraireImmojeune,
		inject: [ExtraireFluxDomainService],
		useFactory: (extraireFluxDomainService: ExtraireFluxDomainService): ExtraireImmojeune => {
			return new ExtraireImmojeune(extraireFluxDomainService);
		},
	}, {
		provide: ExtraireStudapart,
		inject: [ExtraireFluxDomainService],
		useFactory: (extraireFluxDomainService: ExtraireFluxDomainService): ExtraireStudapart => {
			return new ExtraireStudapart(extraireFluxDomainService);
		},
	}],
	exports: [ExtraireImmojeune, ExtraireStudapart],
})
export class Usecases {
}
