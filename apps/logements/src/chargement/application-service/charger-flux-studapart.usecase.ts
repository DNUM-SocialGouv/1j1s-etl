import { FluxChargement } from "@logements/src/chargement/domain/model/flux";
import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/src/chargement/domain/service/charger-annonces-de-logement.domain-service";

import { Usecase } from "@shared/src/application-service/usecase";

export class ChargerFluxStudapart implements Usecase {
	constructor(private readonly chargerAnnonceDeLogement: ChargerAnnoncesDeLogementDomainService) {
	}

	executer(flux: FluxChargement): Promise<void> {
		return this.chargerAnnonceDeLogement.charger(flux);
	}
}
