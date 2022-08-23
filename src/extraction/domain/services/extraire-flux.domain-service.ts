import { ConfigurationFlux } from "@extraction/domain/configuration-flux";
import { DateService } from "@extraction/domain/services/date.service";
import { FluxClient } from "@extraction/domain/flux.client";
import { StorageClient } from "@extraction/domain/storage.client";

export class ExtraireFluxDomainService {
	static readonly SEPARATEUR_DE_CHEMIN = "/";
	static readonly NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";

	constructor(
		private readonly fluxClient: FluxClient,
		private readonly storageClient: StorageClient,
		private readonly dateService: DateService,
	) {
	}

	async extraire(configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const contenuDuFlux = await this.fluxClient.recuperer(configurationFlux.url);
		await this.sauvegarderLeFlux(configurationFlux, contenuDuFlux);
	}

	private async sauvegarderLeFlux(configurationFlux: Readonly<ConfigurationFlux>, contenuDuFlux: string): Promise<void> {
		await this.historiserLeFlux(configurationFlux, contenuDuFlux);
		await this.sauvegarderDerniereVersionDuFlux(contenuDuFlux, configurationFlux);
	}

	private async historiserLeFlux(configurationFlux: Readonly<ConfigurationFlux>, contenuDuFlux: string): Promise<void> {
		const nomDuFichierHistorise = this.creerNomDuFichierAHistoriser(configurationFlux);
		await this.storageClient.enregistrer(nomDuFichierHistorise, contenuDuFlux, configurationFlux.nom);
	}

	private async sauvegarderDerniereVersionDuFlux(contenuDuFlux: string, configurationFlux: Readonly<ConfigurationFlux>): Promise<void> {
		const nomDuDernierFicher = this.creerNomDuDernierFichier(configurationFlux);
		await this.storageClient.enregistrer(nomDuDernierFicher, contenuDuFlux, configurationFlux.nom);
	}

	private creerNomDuFichierAHistoriser(configurationFlux: Readonly<ConfigurationFlux>): string {
		const { SEPARATEUR_DE_CHEMIN } = ExtraireFluxDomainService;
		const nomDuFichierHistorise = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(configurationFlux.dossierHistorisation)
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(this.dateService.maintenant().toISOString())
			.concat(configurationFlux.extension);
		return nomDuFichierHistorise;
	}

	private creerNomDuDernierFichier(configurationFlux: Readonly<ConfigurationFlux>): string {
		const {
			SEPARATEUR_DE_CHEMIN,
			NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE,
		} = ExtraireFluxDomainService;
		const nomDuDernierFicher = configurationFlux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(configurationFlux.extension);
		return nomDuDernierFicher;
	}
}
