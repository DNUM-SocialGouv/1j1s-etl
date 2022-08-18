import { ConfigurationFlux } from "@transformation/domain/configuration-flux";
import { DateService } from "@shared/date.service";
import { OffreDeStageRepository } from "@transformation/domain/offre-de-stage.repository";
import { StagefrDecompresse } from "@transformation/domain/stagefr-decompresse";
import { Usecase } from "@shared/usecase";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";


export class TransformerFluxStagefrDecompresse implements Usecase {
	static readonly INDENTATION_JSON = 2;
	static NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";
	static readonly REMPLACANT_JSON = null;
	static SEPARATEUR_DE_CHEMIN = "/";

	constructor(
		private readonly dateService: DateService,
		private readonly offreDeStageRepository: OffreDeStageRepository,
		private readonly convertir: StagefrDecompresse.Convertir
	) {
	}

	async executer(configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const contenu = await this.recupererContenuDuFluxATransformer<StagefrDecompresse.Contenu>(configurationFlux);

		const contenuTransforme = this.transformerVers1Jeune1Solution(contenu);

		await this.sauvegarderLeFluxTransforme(contenuTransforme, configurationFlux);
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

	private async sauvegarderLeFluxTransforme(contenuTransforme: UnJeune1Solution.OffreDeStage[], configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		await this.sauvegarderFichierDHistorisation(configurationFlux, contenuTransforme);
		await this.sauvegarderDerniereVersionDuFichier(configurationFlux, contenuTransforme);
	}

	private async sauvegarderFichierDHistorisation(configurationFlux: Readonly<ConfigurationFlux>, contenuTransforme: UnJeune1Solution.OffreDeStage[]): Promise<void> {
		const cheminDuFichierAHistoriser = this.creerNomDuFichierAHistoriser(configurationFlux);
		await this.offreDeStageRepository.enregistrer(cheminDuFichierAHistoriser, this.versJsonLisible(contenuTransforme), configurationFlux.nom);
	}

	private async sauvegarderDerniereVersionDuFichier(configurationFlux: Readonly<ConfigurationFlux>, contenuTransforme: UnJeune1Solution.OffreDeStage[]): Promise<void> {
		const cheminDeLaDerniereVersionDuFichier = this.creerNomDeLaDerniereVersionDuFichier(configurationFlux);
		await this.offreDeStageRepository.enregistrer(cheminDeLaDerniereVersionDuFichier, this.versJsonLisible(contenuTransforme), configurationFlux.nom);
	}

	private creerNomDuFichierAHistoriser(configurationFlux: Readonly<ConfigurationFlux>): string {
		const { SEPARATEUR_DE_CHEMIN } = TransformerFluxStagefrDecompresse;
		return configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(configurationFlux.dossierHistorisation)
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(this.dateService.maintenant().toISOString())
			.concat(configurationFlux.extensionFichierTransforme);
	}

	private creerNomDeLaDerniereVersionDuFichier(configurationFlux: Readonly<ConfigurationFlux>): string {
		const { SEPARATEUR_DE_CHEMIN } = TransformerFluxStagefrDecompresse;
		return configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat("latest")
			.concat(configurationFlux.extensionFichierTransforme);
	}

	private versJsonLisible(contenuTransforme: Array<UnJeune1Solution.OffreDeStage>): string {
		const { INDENTATION_JSON, REMPLACANT_JSON } = TransformerFluxStagefrDecompresse;
		return JSON.stringify(contenuTransforme, REMPLACANT_JSON, INDENTATION_JSON);
	}
}
