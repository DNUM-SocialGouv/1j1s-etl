import {
	ChargerOffresDeStageDomainService,
} from "@chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { Usecase } from "@shared/usecase";

export class ChargerFluxStagefrDecompresse implements Usecase {
	static NOM_DU_FLUX = "stagefr-uncompressed";
	static EXTENSION_DU_FICHIER_DE_RESULTAT = ".json";

	constructor(private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService) {
	}

	async executer(): Promise<void> {
		await this.chargerOffresDeStages.charger(
			ChargerFluxStagefrDecompresse.NOM_DU_FLUX,
			ChargerFluxStagefrDecompresse.EXTENSION_DU_FICHIER_DE_RESULTAT
		);
	}
}
