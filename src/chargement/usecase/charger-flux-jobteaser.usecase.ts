import {
	ChargerOffresDeStageDomainService,
} from "@chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { Usecase } from "@shared/usecase";

export class ChargerFluxJobteaser implements Usecase {
	static NOM_DU_FLUX = "jobteaser";
	static EXTENSION_DU_FICHIER_DE_RESULTAT = ".json";

	constructor(
		private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService
	) {
	}

	async executer(): Promise<void> {
		await this.chargerOffresDeStages.charger(
			ChargerFluxJobteaser.NOM_DU_FLUX,
			ChargerFluxJobteaser.EXTENSION_DU_FICHIER_DE_RESULTAT
		);
	}
}
