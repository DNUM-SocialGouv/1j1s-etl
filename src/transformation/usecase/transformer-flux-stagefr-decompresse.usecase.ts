import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { StagefrDecompresse } from "@transformation/domain/stagefr-decompresse";
import { Usecase } from "@shared/usecase";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";


export class TransformerFluxStagefrDecompresse implements Usecase {
	static NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";
	static SEPARATEUR_DE_CHEMIN = "/";

	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: StagefrDecompresse.Convertir
	) {
	}

	async executer(configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const contenu = await this.recupererContenuDuFluxATransformer<StagefrDecompresse.Contenu>(configurationFlux);

		const contenuTransforme = this.transformerVers1Jeune1Solution(contenu);

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, configurationFlux);
	}

	private recupererContenuDuFluxATransformer<T>(configurationFlux: ConfigurationFlux): Promise<T> {
		const { SEPARATEUR_DE_CHEMIN, NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE } = TransformerFluxStagefrDecompresse;
		const fichierARecuperer = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extensionFichierBrut);
		return this.offreDeStageRepository.recuperer<T>(fichierARecuperer);
	}

	private transformerVers1Jeune1Solution(contenu: StagefrDecompresse.Contenu): Array<UnJeune1Solution.OffreDeStage> {
		return contenu.jobs.job.map((offreDeStage) => this.convertir.depuisStagefrDecompresse(offreDeStage));
	}
}
