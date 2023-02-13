import {
	BilanEnergetique as _BilanEnergetique,
	ImagesUrl as _ImagesUrl,
	Localisation as _Localisation,
	ServiceInclus as _ServiceInclus,
	ServiceOptionnel as _ServiceOptionnel,
	Source as _Source,
	TypeAnnonce as _Type,
	TypeBien as _TypeBien,
} from "@logements/src/chargement/domain/model/1jeune1solution/types";

export namespace UnJeune1Solution {
	export type BilanEnergetique = _BilanEnergetique;
	export type ImagesUrl = _ImagesUrl;
	export type Localisation = _Localisation;
	export const ServiceInclus = _ServiceInclus;
	export type ServiceInclus = _ServiceInclus;
	export const ServiceOptionnel = _ServiceOptionnel;
	export type ServiceOptionnel = _ServiceOptionnel;
	export type Source = _Source;
	export const Source = _Source;
	export type TypeAnnonce = _Type;
	export const TypeAnnonce = _Type;
	export type TypeBien = _TypeBien;
	export const TypeBien = _TypeBien;

	export type AttributsAnnonceDeLogement = {
		identifiantSource: string
		nombreDePieces?: number
		titre?: string
		description?: string
		url?: string
		source?: UnJeune1Solution.Source
		typeBien?: UnJeune1Solution.TypeBien
		type?: UnJeune1Solution.TypeAnnonce
		surface?: number
		surfaceMax?: number
		etage?: number
		dateDeDisponibilite?: string
		bilanEnergetique?: UnJeune1Solution.BilanEnergetique
		meuble?: boolean
		localisation?: UnJeune1Solution.Localisation
		sourceCreatedAt?: string
		sourceUpdatedAt: string
		imagesUrl?: Array<UnJeune1Solution.ImagesUrl>
		servicesInclus?: Array<UnJeune1Solution.ServiceInclus>
		servicesOptionnels?: Array<UnJeune1Solution.ServiceOptionnel>
		prixHT?: number
		prix?: number
		devise?: string
		charge?: number
		garantie?: number
	}

	export class AnnonceDeLogement {
		public readonly identifiantSource: string;
		public readonly nombreDePieces?: number;
		public readonly titre?: string;
		public readonly description?: string;
		public readonly url?: string;
		public readonly source?: UnJeune1Solution.Source;
		public readonly typeBien?: UnJeune1Solution.TypeBien;
		public readonly type?: UnJeune1Solution.TypeAnnonce;
		public readonly surface?: number;
		public readonly surfaceMax?: number;
		public readonly etage?: number;
		public readonly dateDeDisponibilite?: string;
		public readonly bilanEnergetique?: UnJeune1Solution.BilanEnergetique;
		public readonly meuble?: boolean;
		public readonly localisation?: UnJeune1Solution.Localisation;
		public readonly sourceCreatedAt?: string;
		public readonly sourceUpdatedAt: string;
		public readonly imagesUrl?: Array<UnJeune1Solution.ImagesUrl>;
		public readonly servicesInclus?: Array<UnJeune1Solution.ServiceInclus>;
		public readonly servicesOptionnels?: Array<UnJeune1Solution.ServiceOptionnel>;
		public readonly prixHT?: number;
		public readonly prix?: number;
		public readonly devise?: string;
		public readonly charge?: number;
		public readonly garantie?: number;

		constructor(attributs: AttributsAnnonceDeLogement) {
			this.identifiantSource = attributs.identifiantSource;
			this.nombreDePieces = attributs.nombreDePieces;
			this.titre = attributs.titre;
			this.description = attributs.description;
			this.url = attributs.url;
			this.source = attributs.source;
			this.typeBien = attributs.typeBien;
			this.type = attributs.type;
			this.surface = attributs.surface;
			this.surfaceMax = attributs.surfaceMax;
			this.etage = attributs.etage;
			this.dateDeDisponibilite = attributs.dateDeDisponibilite;
			this.bilanEnergetique = attributs.bilanEnergetique;
			this.meuble = attributs.meuble;
			this.localisation = attributs.localisation;
			this.sourceCreatedAt = attributs.sourceCreatedAt;
			this.sourceUpdatedAt = attributs.sourceUpdatedAt;
			this.imagesUrl = attributs.imagesUrl;
			this.servicesInclus = attributs.servicesInclus;
			this.servicesOptionnels = attributs.servicesOptionnels;
			this.prixHT = attributs.prixHT;
			this.prix = attributs.prix;
			this.devise = attributs.devise;
			this.charge = attributs.charge;
			this.garantie = attributs.garantie;
		}

		public recupererAttributs(): AttributsAnnonceDeLogement {
			return {
				identifiantSource: this.identifiantSource,
				nombreDePieces: this.nombreDePieces,
				titre: this.titre,
				description: this.description,
				url: this.url,
				source: this.source,
				typeBien: this.typeBien,
				type: this.type,
				surface: this.surface,
				surfaceMax: this.surfaceMax,
				etage: this.etage,
				dateDeDisponibilite: this.dateDeDisponibilite,
				bilanEnergetique: this.bilanEnergetique,
				meuble: this.meuble,
				localisation: this.localisation,
				sourceCreatedAt: this.sourceCreatedAt,
				sourceUpdatedAt: this.sourceUpdatedAt,
				imagesUrl: this.imagesUrl,
				servicesInclus: this.servicesInclus,
				servicesOptionnels: this.servicesOptionnels,
				prixHT: this.prixHT,
				prix: this.prix,
				devise: this.devise,
				charge: this.charge,
				garantie: this.garantie,
			};
		}
	}

	export type AnnonceDeLogementReferencee = {
		id: string;
		identifiantSource: string;
		sourceUpdatedAt: string;
	}

	export type AnnonceDeLogementEnErreur = {
		motif: string,
		annonce: AnnonceDeLogement
	}

	export class NouvelleAnnonceDeLogement extends AnnonceDeLogement {
		constructor(attributs: UnJeune1Solution.AttributsAnnonceDeLogement) {
			super(attributs);
		}
	}

	export class AnnonceDeLogementAMettreAJour extends AnnonceDeLogement {
		constructor(attributs: UnJeune1Solution.AttributsAnnonceDeLogement, public readonly id: string) {
			super(attributs);
		}
	}

	export class AnnonceDeLogementObsolete extends AnnonceDeLogement {
		constructor(attributs: UnJeune1Solution.AttributsAnnonceDeLogement, public readonly id: string) {
			super(attributs);
		}
	}
}
