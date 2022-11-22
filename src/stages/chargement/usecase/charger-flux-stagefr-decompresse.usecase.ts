import {
	ChargerOffresDeStageDomainService,
} from "@stages/chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { Usecase } from "@shared/usecase";
import { FluxChargement } from "@stages/chargement/domain/1jeune1solution/flux";

export class ChargerFluxStagefrDecompresse implements Usecase {
	constructor(private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService) {
	}

	public async executer(flux: FluxChargement): Promise<void> {
		await this.chargerOffresDeStages.charger(flux);
	}
}
