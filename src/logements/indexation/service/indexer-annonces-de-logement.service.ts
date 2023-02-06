import { Configuration } from "@logements/indexation/configuration/configuration";
import { AnnonceDeLogement } from "@logements/indexation/service/types";
import { IndexingClient } from "@shared/infrastructure/gateway/client/meilisearch-indexing.client";
import { HttpClient } from "@shared/infrastructure/gateway/client/strapi-http-client";

export class IndexerAnnoncesDeLogement {
	private static readonly BATCH_SIZE = 5000;
	private static readonly FIELDS_TO_RETRIEVE = "id,slug,titre,dateDeDisponibilite,devise,prix,prixHT,surface,surfaceMax,type,url,sourceUpdatedAt";
	private static readonly INDEX = "annonces-de-logement";
	private static readonly RELATIONS_TO_RETRIEVE = "localisation,imagesUrl";

	constructor(
		private readonly indexingClient: IndexingClient,
		private readonly strapiHttpClient: HttpClient,
		private readonly configuration: Configuration,
	) {
	}

	public async executer(source: string): Promise<void> {
		const annoncesDeLogement = await this.strapiHttpClient.get<AnnonceDeLogement.Brute>(
			this.configuration.STRAPI.ENDPOINT,
			source,
			IndexerAnnoncesDeLogement.FIELDS_TO_RETRIEVE,
			IndexerAnnoncesDeLogement.RELATIONS_TO_RETRIEVE,
		);
		await this.indexingClient.index<AnnonceDeLogement.AIndexer>(
			IndexerAnnoncesDeLogement.INDEX,
			this.versAnnoncesDeLogementAIndexer(annoncesDeLogement),
			IndexerAnnoncesDeLogement.BATCH_SIZE,
		);
	}

	private versAnnoncesDeLogementAIndexer(annoncesDeLogement: Array<AnnonceDeLogement.Brute>): Array<AnnonceDeLogement.AIndexer> {
		return annoncesDeLogement.map(
			(annonceDeLogement) => this.versAnnonceDeLogementAIndexer(annonceDeLogement),
		);
	}

	private versAnnonceDeLogementAIndexer(annonceDeLogement: AnnonceDeLogement.Brute): AnnonceDeLogement.AIndexer {
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

	private getLocalisationToDisplay(localisation: AnnonceDeLogement.Localisation): string {
		const { ville, codePostal } = localisation;
		if (ville && codePostal) return codePostal + " - " + ville;
		if (codePostal) return String(codePostal);
		return ville;
	}
}
