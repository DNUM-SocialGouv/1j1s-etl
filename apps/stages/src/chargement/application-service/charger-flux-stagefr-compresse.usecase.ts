import { Usecase } from "@shared/src/application-service/usecase";

import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/src/chargement/domain/service/charger-offres-de-stage.domain-service";

export class ChargerFluxStagefrCompresse implements Usecase {
	constructor(private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService) {
	}

	public async executer(flux: FluxChargement): Promise<void> {
		await this.chargerOffresDeStages.charger(flux);
	}
}
