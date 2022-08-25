import { DateService } from "@shared/date.service";
import { Flux } from "@extraction/domain/flux";
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

	async extraire(flux: Readonly<Flux>): Promise<void> {
		const contenuDuFlux = await this.fluxClient.recuperer(flux.url);
		await this.sauvegarderLeFlux(flux, contenuDuFlux);
	}

	private async sauvegarderLeFlux(flux: Readonly<Flux>, contenuDuFlux: string): Promise<void> {
		await this.historiserLeFlux(flux, contenuDuFlux);
		await this.sauvegarderDerniereVersionDuFlux(flux, contenuDuFlux);
	}

	private async historiserLeFlux(flux: Readonly<Flux>, contenuDuFlux: string): Promise<void> {
		const nomDuFichierHistorise = this.creerNomDuFichierAHistoriser(flux);
		await this.storageClient.enregistrer(nomDuFichierHistorise, contenuDuFlux, flux.nom);
	}

	private async sauvegarderDerniereVersionDuFlux(flux: Readonly<Flux>, contenuDuFlux: string): Promise<void> {
		const nomDuDernierFicher = this.creerNomDuDernierFichier(flux);
		await this.storageClient.enregistrer(nomDuDernierFicher, contenuDuFlux, flux.nom);
	}

	private creerNomDuFichierAHistoriser(flux: Readonly<Flux>): string {
		const { SEPARATEUR_DE_CHEMIN } = ExtraireFluxDomainService;
		const nomDuFichierHistorise = flux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(flux.dossierHistorisation)
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(this.dateService.maintenant().toISOString())
			.concat(flux.extension);
		return nomDuFichierHistorise;
	}

	private creerNomDuDernierFichier(flux: Readonly<Flux>): string {
		const {
			SEPARATEUR_DE_CHEMIN,
			NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE,
		} = ExtraireFluxDomainService;
		const nomDuDernierFicher = flux.nom
			.concat(SEPARATEUR_DE_CHEMIN)
			.concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
			.concat(flux.extension);
		return nomDuDernierFicher;
	}
}
