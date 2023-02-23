import { FluxChargement } from "@logements/src/chargement/domain/model/flux";
import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/src/chargement/domain/service/charger-annonces-de-logement.domain-service";

import { Usecase } from "@shared/src/usecase";

export class ChargerFluxImmojeune implements Usecase {
	constructor(private readonly chargerAnnoncesDeLogement: ChargerAnnoncesDeLogementDomainService) {
	}

	public async executer(flux: FluxChargement): Promise<void> {
		await this.chargerAnnoncesDeLogement.charger(flux);
	}
}
