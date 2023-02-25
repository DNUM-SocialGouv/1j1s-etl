import { Module } from "@nestjs/common";

import { ChargerFluxImmojeune } from "@logements/src/chargement/application-service/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/src/chargement/application-service/charger-flux-studapart.usecase";
import { AnnonceDeLogementRepository } from "@logements/src/chargement/domain/service/annonce-de-logement.repository";
import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/src/chargement/domain/service/charger-annonces-de-logement.domain-service";
import { Gateways } from "@logements/src/chargement/infrastructure/gateway";

@Module({
	imports: [Gateways],
	providers: [{
		provide: ChargerAnnoncesDeLogementDomainService,
		inject: ["AnnonceDeLogementRepository"],
		useFactory: (annonceDeLogementRepository: AnnonceDeLogementRepository): ChargerAnnoncesDeLogementDomainService => {
			return new ChargerAnnoncesDeLogementDomainService(annonceDeLogementRepository);
		},
	}, {
		provide: ChargerFluxImmojeune,
		inject: [ChargerAnnoncesDeLogementDomainService],
		useFactory: (chargerAnnoncesDeLogementDomainService: ChargerAnnoncesDeLogementDomainService): ChargerFluxImmojeune => {
			return new ChargerFluxImmojeune(chargerAnnoncesDeLogementDomainService);
		},
	}, {
		provide: ChargerFluxStudapart,
		inject: [ChargerAnnoncesDeLogementDomainService],
		useFactory: (chargerAnnoncesDeLogementDomainService: ChargerAnnoncesDeLogementDomainService): ChargerFluxStudapart => {
			return new ChargerFluxStudapart(chargerAnnoncesDeLogementDomainService);
		},
	}],
	exports: [ChargerFluxImmojeune, ChargerFluxStudapart],
})
export class Usecases {
}
