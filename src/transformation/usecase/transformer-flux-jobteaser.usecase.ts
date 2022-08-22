import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class TransformerFluxJobteaser implements Usecase {
	static readonly NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";
	static readonly SEPARATEUR_DE_CHEMIN = "/";

	constructor(
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertirOffreDeStage: Jobteaser.Convertir,
	) {
	}

	async executer<T>(configurationFlux: Readonly<ConfigurationFlux>): Promise<void | T> {
		const contenuDuFlux = await this.recupererContenuDuFluxATransformer<Jobteaser.Contenu>(configurationFlux);

		const contenuTransforme: Array<UnJeune1Solution.OffreDeStage>
			= contenuDuFlux.jobs.job.map((job: Jobteaser.OffreDeStage) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.offreDeStageRepository.sauvegarder(contenuTransforme, configurationFlux);
	}

	private recupererContenuDuFluxATransformer<T>(configurationFlux: ConfigurationFlux): Promise<T> {
		const { SEPARATEUR_DE_CHEMIN, NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE } = TransformerFluxJobteaser;
		const fichierARecuperer = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extensionFichierBrut);
		return this.offreDeStageRepository.recuperer<T>(fichierARecuperer);
	}
}
