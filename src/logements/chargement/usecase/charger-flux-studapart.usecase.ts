import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/chargement/domain/1jeune1solution/services/charger-annonces-de-logement.domain-service";
import { FluxChargement } from "@logements/chargement/domain/flux";
import { Usecase } from "@shared/usecase";

export class ChargerFluxStudapart implements Usecase {
	constructor(private readonly chargerAnnonceDeLogement: ChargerAnnoncesDeLogementDomainService) {
	}

	executer(flux: FluxChargement): Promise<void> {
		return this.chargerAnnonceDeLogement.charger(flux);
	}
}
