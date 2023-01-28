import {
	ChargerOffresDeStageDomainService,
} from "@stages/chargement/domain/service/charger-offres-de-stage.domain-service";
import { FluxChargement } from "@stages/chargement/domain/model/flux";
import { Usecase } from "@shared/usecase";

export class ChargerFluxStagefrCompresse implements Usecase {
	constructor(private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService) {
	}

	public async executer(flux: FluxChargement): Promise<void> {
		await this.chargerOffresDeStages.charger(flux);
	}
}
