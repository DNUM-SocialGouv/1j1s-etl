import {
	ChargerOffresDeStageDomainService,
} from "@chargement/domain/1jeune1solution/services/charger-offres-de-stage.domain-service";
import { Usecase } from "@shared/usecase";

export class ChargerFluxJobteaser implements Usecase {
	private static NOM_DU_FLUX = "jobteaser";
	private static EXTENSION_DU_FICHIER_DE_RESULTAT = ".json";

	constructor(private readonly chargerOffresDeStages: ChargerOffresDeStageDomainService) {
	}

	public async executer(): Promise<void> {
		await this.chargerOffresDeStages.charger(
			ChargerFluxJobteaser.NOM_DU_FLUX,
			ChargerFluxJobteaser.EXTENSION_DU_FICHIER_DE_RESULTAT
		);
	}
}
