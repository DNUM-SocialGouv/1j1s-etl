export namespace UnJeune1Solution {
	export type AttributsDOffreDeStage = {
		titre?: string,
		dateDeDebutMax?: string,
		dateDeDebutMin?: string,
		description?: string,
		urlDeCandidature?: string,
		sourceCreatedAt?: string,
		sourceUpdatedAt: string,
		sourcePublishedAt?: string,
		identifiantSource?: string,
		domaines?: Array<string>,
		dureeEnJour?: number,
		dureeEnJourMax?: number,
		localisation?: Localisation,
		employeur?: Employeur,
		remunerationMin?: number,
		remunerationMax?: number,
		remunerationPeriode?: string,
		source?: string,
		teletravailPossible?: boolean
	}

	export type OffreDeStageEnErreur = {
		contenuDeLOffre: OffreDeStage,
		motif?: string
	}

	export class OffreDeStageExistante {
		public readonly id: string;
		public readonly identifiantSource: string;
		public readonly sourceUpdatedAt: Date;

		constructor(id: string, identifiantSource: string, sourceUpdatedAt: string) {
			this.id = id;
			this.identifiantSource = identifiantSource;
			this.sourceUpdatedAt = sourceUpdatedAt ? new Date(sourceUpdatedAt) : new Date("1971-01-01T:00:00:00.000Z");
		}
	}

	export class OffreDeStage {
		public readonly titre?: string;
		public readonly dateDeDebutMin?: string;
		public readonly dateDeDebutMax?: string;
		public readonly description?: string;
		public readonly urlDeCandidature?: string;
		public readonly sourceCreatedAt?: Date;
		public readonly sourceUpdatedAt: Date;
		public readonly sourcePublishedAt?: Date;
		public readonly identifiantSource?: string;
		public readonly domaines?: Array<string>;
		public readonly dureeEnJour?: number;
		public readonly dureeEnJourMax?: number;
		public readonly localisation?: Localisation;
		public readonly employeur?: Employeur;
		public readonly remunerationMin?: number;
		public readonly remunerationMax?: number;
		public readonly remunerationPeriode?: string;
		public readonly source?: string;
		public readonly teletravailPossible?: boolean;

		constructor(attributs: AttributsDOffreDeStage) {
			this.titre = attributs.titre;
			this.dateDeDebutMax = attributs.dateDeDebutMax;
			this.dateDeDebutMin = attributs.dateDeDebutMin;
			this.description = attributs.description;
			this.urlDeCandidature = attributs.urlDeCandidature;
			this.sourceCreatedAt = attributs.sourceCreatedAt ? new Date(attributs.sourceCreatedAt) : undefined;
			this.sourceUpdatedAt = new Date(attributs.sourceUpdatedAt);
			this.sourcePublishedAt = attributs.sourcePublishedAt ? new Date(attributs.sourcePublishedAt) : undefined;
			this.identifiantSource = attributs.identifiantSource;
			this.domaines = attributs.domaines;
			this.dureeEnJour = attributs.dureeEnJour;
			this.dureeEnJourMax = attributs.dureeEnJourMax;
			this.localisation = attributs.localisation;
			this.employeur = attributs.employeur;
			this.source = attributs.source;
			this.teletravailPossible = attributs.teletravailPossible;
			this.remunerationMin = attributs.remunerationMin;
			this.remunerationMax = attributs.remunerationMax;
			this.remunerationPeriode = attributs.remunerationPeriode;
		}

		public recupererAttributs(): Readonly<AttributsDOffreDeStage> {
			return {
				titre: this.titre,
				dateDeDebutMax: this.dateDeDebutMax,
				dateDeDebutMin: this.dateDeDebutMin,
				description: this.description,
				urlDeCandidature: this.urlDeCandidature,
				sourceCreatedAt: this.sourceCreatedAt ? this.sourceCreatedAt.toISOString() : undefined,
				sourceUpdatedAt: this.sourceUpdatedAt.toISOString(),
				sourcePublishedAt: this.sourcePublishedAt ? this.sourcePublishedAt.toISOString() : undefined,
				identifiantSource: this.identifiantSource?.toString(),
				domaines: this.domaines,
				dureeEnJour: this.dureeEnJour,
				dureeEnJourMax: this.dureeEnJourMax,
				localisation: this.localisation,
				employeur: this.employeur,
				remunerationMin: this.remunerationMin,
				remunerationMax: this.remunerationMax,
				remunerationPeriode: this.remunerationPeriode,
				source: this.source,
				teletravailPossible: this.teletravailPossible,
			};
		}
	}

	export class OffreDeStageAPublier extends OffreDeStage {
		constructor(attributs: AttributsDOffreDeStage) {
			super(attributs);
		}
	}

	export class OffreDeStageASupprimer extends OffreDeStage {
		constructor(
			attributs: AttributsDOffreDeStage,
			public readonly id: string
		) {
			super(attributs);
		}
	}

	export class OffreDeStageAMettreAJour extends OffreDeStage {
		constructor(
			attributs: AttributsDOffreDeStage,
			public readonly id: string
		) {
			super(attributs);
		}
	}

	export interface OffreDeStageRepository {
		charger(source: string, offresDeStages: Array<UnJeune1Solution.OffreDeStage>): Promise<Array<UnJeune1Solution.OffreDeStageEnErreur>>;
		recupererMisesAJourDesOffres(nomDuFlux: string): Promise<Array<OffreDeStage>>;
		recupererOffresExistantes(nomDuFlux: string): Promise<Array<{ identifiantSource: string, sourceUpdatedAt: Date, id: string }>>;
		enregistrer(cheminDuFichier: string, contenu: string, nomDuFlux: string): Promise<void>;
	}

	type Employeur = {
		nom: string
		description?: string
		logoUrl: string
		siteUrl: string
	}

	type Localisation = {
		ville?: string
		departement?: string
		codePostal?: string
		region?: string
		pays: string
		latitude?: number
		longitude?: number
	}
}
