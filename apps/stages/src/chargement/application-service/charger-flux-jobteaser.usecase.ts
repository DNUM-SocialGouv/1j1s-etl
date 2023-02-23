import { Usecase } from "@shared/src/usecase";

import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/src/chargement/domain/service/charger-offres-de-stage.domain-service";

export class ChargerFluxJobteaser implements Usecase {
	constructor(private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService) {
	}

	public async executer(flux: FluxChargement): Promise<void> {
		await this.chargerOffresDeStages.charger(flux);
	}
}
