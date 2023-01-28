import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/chargement/domain/service/charger-annonces-de-logement.domain-service";
import { FluxChargement } from "@logements/chargement/domain/model/flux";
import { Usecase } from "@shared/usecase";

export class ChargerFluxStudapart implements Usecase {
	constructor(private readonly chargerAnnonceDeLogement: ChargerAnnoncesDeLogementDomainService) {
	}

	executer(flux: FluxChargement): Promise<void> {
		return this.chargerAnnonceDeLogement.charger(flux);
	}
}
