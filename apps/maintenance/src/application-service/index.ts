import { Module } from "@nestjs/common";

import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { OffreDeStageRepository } from "@maintenance/src/domain/service/offre-de-stage.repository";
import { Gateways } from "@maintenance/src/infrastructure/gateway";

@Module({
	imports: [Gateways],
	providers: [{
		provide: PurgerLesOffresDeStage,
		inject: ["OffreDeStageRepository"],
		useFactory: (offreDeStageRepository: OffreDeStageRepository) : PurgerLesOffresDeStage=> {
			return new PurgerLesOffresDeStage(offreDeStageRepository);
		},
	}],
	exports: [PurgerLesOffresDeStage],
})
export class Usecases {

}
