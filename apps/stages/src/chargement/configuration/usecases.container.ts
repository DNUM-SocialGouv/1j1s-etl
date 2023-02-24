import { Module } from "@nestjs/common";

import { DateService } from "@shared/src/date.service";

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

@Module({
	imports: [Usecases],
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
		ChargerFluxJobteaser,
		ChargerFluxStagefrCompresse,
		ChargerFluxStagefrDecompresse,
	],
})
export class Usecases {
}
