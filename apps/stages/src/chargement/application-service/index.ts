import { Module } from "@nestjs/common";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";

import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import {
	ChargerFluxStagefrCompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import {
	ChargerFluxStagefrDecompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import { UnJeune1Solution } from "@stages/src/chargement/domain/model/1jeune1solution";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/src/chargement/domain/service/charger-offres-de-stage.domain-service";
import { Gateways } from "@stages/src/chargement/infrastructure/gateway";

@Module({
	imports: [Gateways, Shared],
	providers: [
		{
			provide: ChargerOffresDeStageDomainService,
			inject: ["UnJeune1Solution.Repository", DateService],
			useFactory: (
				offreDeStageRepository: UnJeune1Solution.OffreDeStageRepository,
				dateService: DateService,
			): ChargerOffresDeStageDomainService => {
				return new ChargerOffresDeStageDomainService(offreDeStageRepository, dateService);
			},
		},
		{
			provide: ChargerFluxJobteaser,
			inject: [ChargerOffresDeStageDomainService],
			useFactory: (chargerOffresDeStageDomainService: ChargerOffresDeStageDomainService): ChargerFluxJobteaser => {
				return new ChargerFluxJobteaser(chargerOffresDeStageDomainService);
			},
		},
		{
			provide: ChargerFluxStagefrCompresse,
			inject: [ChargerOffresDeStageDomainService],
			useFactory: (chargerOffresDeStageDomainService: ChargerOffresDeStageDomainService): ChargerFluxStagefrCompresse => {
				return new ChargerFluxStagefrCompresse(chargerOffresDeStageDomainService);
			},
		},
		{
			provide: ChargerFluxStagefrDecompresse,
			inject: [ChargerOffresDeStageDomainService],
			useFactory: (chargerOffresDeStageDomainService: ChargerOffresDeStageDomainService): ChargerFluxStagefrDecompresse => {
				return new ChargerFluxStagefrDecompresse(chargerOffresDeStageDomainService);
			},
		},
	],
	exports: [ChargerFluxJobteaser, ChargerFluxStagefrCompresse, ChargerFluxStagefrDecompresse],
})
export class Usecases {
}
