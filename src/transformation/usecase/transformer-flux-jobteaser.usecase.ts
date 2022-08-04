import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { DateService } from "@shared/date.service";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";
import { Usecase } from "@shared/usecase";

export class TransformerFluxJobteaser implements Usecase {
	static readonly INDENTATION_JSON = 2;
	static readonly NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";
	static readonly REMPLACANT_JSON = null;
	static readonly SEPARATEUR_DE_CHEMIN = "/";

	constructor(
		private readonly dateService: DateService,
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertirOffreDeStage: Jobteaser.Convertir,
	) {
	}

	async executer<T>(configurationFlux: Readonly<ConfigurationFlux>): Promise<void | T> {
		const contenuDuFlux = await this.recupererContenuDuFluxATransformer<Jobteaser.Contenu>(configurationFlux);

		const contenuTransforme: Array<UnJeune1Solution.OffreDeStage>
			= contenuDuFlux.jobs.job.map((job: Jobteaser.OffreDeStage) => this.convertirOffreDeStage.depuisJobteaser(job));

		await this.sauvegarderLesFluxTransformes(contenuTransforme, configurationFlux);
	}

	private recupererContenuDuFluxATransformer<T>(configurationFlux: ConfigurationFlux): Promise<T> {
		const { SEPARATEUR_DE_CHEMIN, NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE } = TransformerFluxJobteaser;
		const fichierARecuperer = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extensionFichierBrut);
		return this.offreDeStageRepository.recuperer<T>(fichierARecuperer);
	}

	private async sauvegarderLesFluxTransformes(contenuTransforme: Array<UnJeune1Solution.OffreDeStage>, configurationFlux: ConfigurationFlux): Promise<void> {
		const contenuASauvegarder = this.versJSONLisible(contenuTransforme);

		await this.sauvegarderFichierAHistoriser(contenuASauvegarder, configurationFlux);
		await this.sauvegarderCloneDuDernierFichier(contenuASauvegarder, configurationFlux);
	}

	private versJSONLisible(contenuTransforme: Array<UnJeune1Solution.OffreDeStage>): string {
		const { INDENTATION_JSON, REMPLACANT_JSON } = TransformerFluxJobteaser;
		return JSON.stringify(contenuTransforme, REMPLACANT_JSON, INDENTATION_JSON);
	}

	private async sauvegarderFichierAHistoriser(contenuDuFlux: string, configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const nomDuFichierHistorise = this.creerNomDuFichierAHistoriser(configurationFlux);
		await this.offreDeStageRepository.enregistrer(nomDuFichierHistorise, contenuDuFlux, configurationFlux.nom);
	}

	private async sauvegarderCloneDuDernierFichier(contenuDuFlux: string, configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const nomDuDernierFicher = this.creerNomDuCloneDuDernierFicher(configurationFlux);
		await this.offreDeStageRepository.enregistrer(nomDuDernierFicher, contenuDuFlux, configurationFlux.nom);
	}

	private creerNomDuCloneDuDernierFicher(configurationFlux: Readonly<ConfigurationFlux>): string {
		const { SEPARATEUR_DE_CHEMIN, NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE } = TransformerFluxJobteaser;
		return configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extensionFichierTransforme);
	}

	private creerNomDuFichierAHistoriser(configurationFlux: Readonly<ConfigurationFlux>): string {
		const { SEPARATEUR_DE_CHEMIN } = TransformerFluxJobteaser;
		return configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(configurationFlux.dossierHistorisation)
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(this.dateService.maintenant().toISOString())
			.concat(configurationFlux.extensionFichierTransforme);
	}
}
