import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { DateService } from "@shared/date.service";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { StorageClient } from "@shared/gateway/storage.client";
import { Usecase } from "@shared/usecase";

export class TransformerFluxJobteaser implements Usecase {
	static readonly SEPARATEUR_DE_CHEMIN = "/";
	static readonly NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";

	constructor(
		private readonly dateService: DateService,
		private readonly storageClient: StorageClient,
		private readonly convertirOffreDeStage: Jobteaser.Convertir,
	) {
	}

	async executer<T>(configurationFlux: ConfigurationFlux): Promise<void | T> {
		const contenuDuFlux = await this.recupererContenuDuFluxATransformer<Jobteaser.Contenu>(configurationFlux);

		const contenuTransforme = contenuDuFlux.jobs.job.map((job) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.creerFichierAHistoriser(this.versJSONLisible(contenuTransforme), configurationFlux);
		await this.creerCloneDuDernierFichier(this.versJSONLisible(contenuTransforme), configurationFlux);
	}

	private async recupererContenuDuFluxATransformer<T>(configurationFlux: ConfigurationFlux): Promise<T> {
		const { SEPARATEUR_DE_CHEMIN, NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE } = TransformerFluxJobteaser;
		const fichierARecuperer = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extensionFichierBrut);
		return await this.storageClient.recupererContenu<T>(fichierARecuperer);
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

	private versJSONLisible(contenuTransforme: UnJeune1Solution.OffreDeStage[]): string {
		return JSON.stringify(contenuTransforme, null, 2);
	}
}
