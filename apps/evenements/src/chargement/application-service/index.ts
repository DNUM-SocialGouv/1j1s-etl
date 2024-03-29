import { Module } from "@nestjs/common";

import {
	ChargerFluxTousMobilises,
} from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import { UnJeuneUneSolution } from "@evenements/src/chargement/domain/model/1jeune1solution";
import {
	ChargerEvenenementsDomainService,
} from "@evenements/src/chargement/domain/service/charger-evenements.domain-service";
import { Gateways } from "@evenements/src/chargement/infrastructure/gateway";

@Module({
	imports: [Gateways],
	providers: [{
		provide: ChargerEvenenementsDomainService,
		inject: ["UnJeuneUneSolution.EvenementsRepository"],
		useFactory: (evenementsRepository: UnJeuneUneSolution.EvenementsRepository): ChargerEvenenementsDomainService => {
			return new ChargerEvenenementsDomainService(evenementsRepository);
		},
	}, {
		provide: ChargerFluxTousMobilises,
		inject: [ChargerEvenenementsDomainService],
		useFactory: (chargerEvenementsDomainService: ChargerEvenenementsDomainService): ChargerFluxTousMobilises => {
			return new ChargerFluxTousMobilises(chargerEvenementsDomainService);
		},
	}],
	exports: [ChargerFluxTousMobilises],
})
export class Usecases {
}
