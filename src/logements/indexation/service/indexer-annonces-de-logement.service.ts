import {
	AnnonceDeLogementBrute,
	AnnonceDeLogementAIndexer,
	AnnonceDeLogementRepository, Localisation,
} from "@logements/indexation/service/types";

export class IndexerAnnoncesDeLogement {
	constructor(private readonly annonceDeLogementRepository: AnnonceDeLogementRepository) {
	}

	public async executer(source: string): Promise<void> {
		const annoncesDeLogement = await this.annonceDeLogementRepository.recupererLesAnnonces(source);
		return this.annonceDeLogementRepository.indexer(this.versAnnoncesDeLogementAIndexer(annoncesDeLogement));
	}

	private versAnnoncesDeLogementAIndexer(annoncesDeLogement: Array<AnnonceDeLogementBrute>): Array<AnnonceDeLogementAIndexer> {
		return annoncesDeLogement.map(
			(annonceDeLogement) => this.versAnnonceDeLogementAIndexer(annonceDeLogement),
		);
	}

	private versAnnonceDeLogementAIndexer(annonceDeLogement: AnnonceDeLogementBrute): AnnonceDeLogementAIndexer {
		return {
			id: annonceDeLogement.id,
			slug: annonceDeLogement.slug,
			titre: annonceDeLogement.titre,
			surface: annonceDeLogement.surface,
			surfaceMax: annonceDeLogement.surfaceMax,
			prixHT: annonceDeLogement.prixHT,
			prix: annonceDeLogement.prix,
			dateDeDisponibilite: annonceDeLogement.dateDeDisponibilite,
			url: annonceDeLogement.url,
			type: annonceDeLogement.type,
			sourceUpdatedAt: annonceDeLogement.sourceUpdatedAt,
			dateDeMiseAJour: this.getSourceUpdatedAtToDisplay(annonceDeLogement.sourceUpdatedAt),
			devise: this.getDeviseToDisplay(annonceDeLogement.devise),
			surfaceAAfficher: this.getSurfaceToDisplay(annonceDeLogement.surface, annonceDeLogement.surfaceMax),
			localisationAAfficher: this.getLocalisationToDisplay(annonceDeLogement.localisation),
			imagesUrl: annonceDeLogement.imagesUrl.map((url) => url.value),
		};
	}

	private getSourceUpdatedAtToDisplay(datetime: string): string {
		if (datetime) {
			return datetime.split("T")[0];
		}
		return "";
	}

	private getDeviseToDisplay(devise: string): string {
		if (devise === "euros") {
			return "€";
		}
		return "€";
	}

	private getSurfaceToDisplay(surface: number, surfaceMax: number): string {
		if (surfaceMax) {
			return `de ${surface} à ${surfaceMax} m²`;
		}
		return `${surface}m²`;
	}

	private getLocalisationToDisplay(localisation: Localisation): string {
		const { ville, codePostal } = localisation;
		if (ville && codePostal) return codePostal + " - " + ville;
		if (codePostal) return String(codePostal);
		return ville;
	}
}
