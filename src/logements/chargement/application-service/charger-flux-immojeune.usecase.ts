import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/chargement/domain/service/charger-annonces-de-logement.domain-service";
import { FluxChargement } from "@logements/chargement/domain/model/flux";
import { Usecase } from "@shared/usecase";

export class ChargerFluxImmojeune implements Usecase {
	constructor(private readonly chargerAnnoncesDeLogement: ChargerAnnoncesDeLogementDomainService) {
	}

	public async executer(flux: FluxChargement): Promise<void> {
		await this.chargerAnnoncesDeLogement.charger(flux);
	}
}
