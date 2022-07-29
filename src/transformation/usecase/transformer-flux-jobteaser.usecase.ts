import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { DateService } from "@shared/date.service";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { StorageClient } from "@shared/gateway/storage.client";
import { Usecase } from "@shared/usecase";

export class TransformerFluxJobteaser implements Usecase {
	static readonly SEPARATEUR_DE_CHEMIN = "/";
	static readonly NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";

	constructor(
		private readonly dateService: DateService,
		private readonly storageClient: StorageClient,
		private readonly convertirOffreDeStage: Jobteaser.ConvertirOffreDeStage,
	) {
	}

	async executer<T>(configurationFlux: ConfigurationFlux): Promise<void | T> {
		const contenuDuFlux = await this.recupererContenuDuFluxATransformer(configurationFlux);

		const contenuTransforme = !Array.isArray(contenuDuFlux.jobs.job)
			? this.convertirOffreDeStage.depuisJobteaser(contenuDuFlux.jobs.job)
			: contenuDuFlux.jobs.job.map((job) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.creerFichierAHistoriser(JSON.stringify(contenuTransforme, null, 2), configurationFlux);
		await this.creerCloneDuDernierFichier(JSON.stringify(contenuTransforme, null, 2), configurationFlux);
	}

	private async recupererContenuDuFluxATransformer(configurationFlux: ConfigurationFlux): Promise<Jobteaser.Contenu> {
		const { SEPARATEUR_DE_CHEMIN, NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE } = TransformerFluxJobteaser;
		const fichierARecuperer = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extensionFichierBrut);
		return await this.storageClient.recupererContenu<Jobteaser.Contenu>(fichierARecuperer);
	}

	private async creerFichierAHistoriser(contenuDuFlux: string, configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const { SEPARATEUR_DE_CHEMIN } = TransformerFluxJobteaser;
		const nomDuFichierHistorise = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(configurationFlux.dossierHistorisation)
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(this.dateService.maintenant().toISOString())
			.concat(configurationFlux.extensionFichierJson);
		await this.storageClient.enregistrer(nomDuFichierHistorise, contenuDuFlux, configurationFlux.nom);
	}

	private async creerCloneDuDernierFichier(contenuDuFlux: string, configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const {
			SEPARATEUR_DE_CHEMIN,
			NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE,
		} = TransformerFluxJobteaser;
		const nomDuDernierFicher = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extensionFichierJson);
		await this.storageClient.enregistrer(nomDuDernierFicher, contenuDuFlux, configurationFlux.nom);
	}
}
