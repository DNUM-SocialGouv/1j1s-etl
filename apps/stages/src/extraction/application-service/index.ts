import { Module } from "@nestjs/common";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";

import { ExtraireFluxDomainService } from "@stages/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxRepository } from "@stages/src/extraction/domain/service/flux.repository";
import { Gateways } from "@stages/src/extraction/infrastructure/gateway";

import { ExtraireHellowork } from "./extraire-hellowork.usecase";
import { ExtraireJobteaser } from "./extraire-jobteaser.usecase";
import { ExtraireStagefrCompresse } from "./extraire-stagefr-compresse.usecase";
import { ExtraireStagefrDecompresse } from "./extraire-stagefr-decompresse.usecase";

@Module({
	imports: [Gateways, Shared],
	providers: [
		{
			provide: ExtraireFluxDomainService,
			inject: ["FluxRepository", DateService],
			useFactory: (fluxRepository: FluxRepository, dateService: DateService): ExtraireFluxDomainService => {
				return new ExtraireFluxDomainService(fluxRepository, dateService);
			},
		},
		{
			provide: ExtraireHellowork,
			inject: [ExtraireFluxDomainService],
			useFactory: (extaireFluxDomainService: ExtraireFluxDomainService): ExtraireHellowork => {
				return new ExtraireHellowork(extaireFluxDomainService);
			},
		},
		{
			provide: ExtraireJobteaser,
			inject: [ExtraireFluxDomainService],
			useFactory: (extaireFluxDomainService: ExtraireFluxDomainService): ExtraireJobteaser => {
				return new ExtraireJobteaser(extaireFluxDomainService);
			},
		},
		{
			provide: ExtraireStagefrCompresse,
			inject: [ExtraireFluxDomainService],
			useFactory: (extaireFluxDomainService: ExtraireFluxDomainService): ExtraireStagefrCompresse => {
				return new ExtraireStagefrCompresse(extaireFluxDomainService);
			},
		},
		{
			provide: ExtraireStagefrDecompresse,
			inject: [ExtraireFluxDomainService],
			useFactory: (extaireFluxDomainService: ExtraireFluxDomainService): ExtraireStagefrDecompresse => {
				return new ExtraireStagefrDecompresse(extaireFluxDomainService);
			},
		},
	],
	exports: [ExtraireHellowork, ExtraireJobteaser, ExtraireStagefrCompresse, ExtraireStagefrDecompresse],
})
export class Usecases {
}
