import {
	ChargerOffresDeStageDomainService,
} from "@stages/chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { Usecase } from "@shared/usecase";

export class ChargerFluxStagefrCompresse implements Usecase {
	private static NOM_DU_FLUX = "stagefr-compresse";
	private static EXTENSION_DU_FICHIER_DE_RESULTAT = ".json";

	constructor(private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService) {
	}

	public async executer(): Promise<void> {
		await this.chargerOffresDeStages.charger(
			ChargerFluxStagefrCompresse.NOM_DU_FLUX,
			ChargerFluxStagefrCompresse.EXTENSION_DU_FICHIER_DE_RESULTAT
		);
	}
}
