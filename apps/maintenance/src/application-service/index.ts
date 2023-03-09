import { Module } from "@nestjs/common";

import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { AnnonceDeLogementRepository } from "@maintenance/src/domain/service/annonce-de-logement.repository";
import { OffreDeStageRepository } from "@maintenance/src/domain/service/offre-de-stage.repository";
import { Gateways } from "@maintenance/src/infrastructure/gateway";

@Module({
	imports: [Gateways],
	providers: [
		{
			provide: PurgerLesOffresDeStage,
			inject: ["OffreDeStageRepository"],
			useFactory: (offreDeStageRepository: OffreDeStageRepository): PurgerLesOffresDeStage => {
				return new PurgerLesOffresDeStage(offreDeStageRepository);
			},
		},
		{
			provide: PurgerLesAnnoncesDeLogement,
			inject: ["AnnonceDeLogementRepository"],
			useFactory: (annonceDeLogementRepository: AnnonceDeLogementRepository): PurgerLesAnnoncesDeLogement => {
				return new PurgerLesAnnoncesDeLogement(annonceDeLogementRepository);
			},
		},
	],
	exports: [PurgerLesOffresDeStage, PurgerLesAnnoncesDeLogement],
})
export class Usecases {

}
