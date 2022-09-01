import { DateService } from "@shared/date.service";
import { Flux } from "@extraction/domain/flux";
import { FluxRepository } from "@extraction/domain/flux.repository";

export class ExtraireFluxDomainService {
	private static readonly SEPARATEUR_DE_CHEMIN = "/";
	private static readonly NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";

	constructor(
		private readonly fluxRepository: FluxRepository,
		private readonly dateService: DateService,
	) {
	}

	public async extraire(flux: Readonly<Flux>): Promise<void> {
		const contenuDuFlux = await this.fluxRepository.recuperer(flux);
		await this.sauvegarderLeFlux(flux, contenuDuFlux);
	}

	private async sauvegarderLeFlux(flux: Readonly<Flux>, contenuDuFlux: string): Promise<void> {
		await this.historiserLeFlux(flux, contenuDuFlux);
		await this.sauvegarderDerniereVersionDuFlux(flux, contenuDuFlux);
	}

	private async historiserLeFlux(flux: Readonly<Flux>, contenuDuFlux: string): Promise<void> {
		const nomDuFichierHistorise = this.creerNomDuFichierAHistoriser(flux);
		await this.fluxRepository.enregistrer(nomDuFichierHistorise, contenuDuFlux, flux);
	}

	private async sauvegarderDerniereVersionDuFlux(flux: Readonly<Flux>, contenuDuFlux: string): Promise<void> {
		const nomDuDernierFicher = this.creerNomDuDernierFichier(flux);
		await this.fluxRepository.enregistrer(nomDuDernierFicher, contenuDuFlux, flux);
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
