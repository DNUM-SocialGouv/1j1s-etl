export namespace AnnonceDeLogement {
	export class Brute {
		public readonly id: string;
		public readonly slug: string;
		public readonly titre: string;
		public readonly dateDeDisponibilite: string;
		public readonly devise: string;
		public readonly prix: number;
		public readonly prixHT: number;
		public readonly surface: number;
		public readonly surfaceMax: number;
		public readonly type: string;
		public readonly url: string;
		public readonly imagesUrl: Array<{ value: string }>;
		public readonly sourceUpdatedAt: string;
		public readonly localisation: Localisation;

		constructor(attributs: Attributs) {
			this.id = attributs.id;
			this.slug = attributs.slug;
			this.titre = attributs.titre;
			this.dateDeDisponibilite = attributs.dateDeDisponibilite;
			this.devise = attributs.devise;
			this.prix = attributs.prix;
			this.prixHT = attributs.prixHT;
			this.surface = attributs.surface;
			this.surfaceMax = attributs.surfaceMax;
			this.type = attributs.type;
			this.url = attributs.url;
			this.imagesUrl = attributs.imagesUrl;
			this.sourceUpdatedAt = attributs.sourceUpdatedAt;
			this.localisation = attributs.localisation;
		}

		public preparerPourIndexation(): AIndexer {
			return {
				id: this.id,
				slug: this.slug,
				titre: this.titre,
				surface: this.surface,
				surfaceMax: this.surfaceMax,
				prixHT: this.prixHT,
				prix: this.prix,
				dateDeDisponibilite: this.dateDeDisponibilite,
				url: this.url,
				type: this.type,
				sourceUpdatedAt: this.sourceUpdatedAt,
				dateDeMiseAJour: this.getSourceUpdatedAtToDisplay(this.sourceUpdatedAt),
				devise: this.getDeviseToDisplay(this.devise),
				surfaceAAfficher: this.getSurfaceToDisplay(this.surface, this.surfaceMax),
				localisationAAfficher: this.getLocalisationToDisplay(this.localisation),
				imagesUrl: this.imagesUrl.map((url) => url.value),
			};
		}

		public getSnapshot(): AnnonceDeLogement.Attributs {
			return {
				id: this.id,
				slug: this.slug,
				titre: this.titre,
				dateDeDisponibilite: this.dateDeDisponibilite,
				devise: this.devise,
				prix: this.prix,
				prixHT: this.prixHT,
				surface: this.surface,
				surfaceMax: this.surfaceMax,
				type: this.type,
				url: this.url,
				imagesUrl: this.imagesUrl,
				sourceUpdatedAt: this.sourceUpdatedAt,
				localisation: this.localisation,
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

	export type Attributs = {
		id: string;
		slug: string;
		titre: string;
		dateDeDisponibilite: string;
		devise: string;
		prix: number;
		prixHT: number;
		surface: number;
		surfaceMax: number;
		type: string;
		url: string;
		imagesUrl: Array<{ value: string }>;
		sourceUpdatedAt: string;
		localisation: Localisation;
	}

	export type AIndexer = {
		id: string;
		slug: string;
		titre: string;
		dateDeDisponibilite: string;
		dateDeMiseAJour: string;
		devise: string;
		prix: number;
		prixHT: number;
		surface: number;
		surfaceMax: number;
		surfaceAAfficher: string;
		type: string;
		url: string;
		imagesUrl: Array<string>;
		sourceUpdatedAt: string;
		localisationAAfficher: string;
	}

	export type Localisation = {
		latitude: number;
		longitude: number;
		ville: string;
		adresse: string;
		departement: string;
		codePostal: string;
		region: string;
		pays: string;
	}
}
