import {
	Contenu as _Contenu,
	Duree as _Duree,
	OffreDeStage as _OffreDeStage,
} from "@transformation/domain/jobteaser/offre-de-stage";
import { DateService } from "@shared/date.service";
import { Domaine as _Domaine } from "@transformation/domain/jobteaser/domaine";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export namespace Jobteaser {
	export type Contenu = _Contenu;
	export import Domaine = _Domaine;
	export type Duree = _Duree;
	export type OffreDeStage = _OffreDeStage;

	export class ConvertirOffreDeStage {
		private static NOMBRE_DE_JOURS_DANS_UN_MOIS = 30;

		constructor(
			private readonly dateService: DateService,
			private readonly correspondanceDomaines: CorrespondanceDomaine
		) {
		}

		depuisJobteaser(offreDeStage: Jobteaser.OffreDeStage): UnJeune1Solution.OffreDeStage {
			return {
				titre: offreDeStage.title,
				description: offreDeStage.mission,
				employeur: {
					description: offreDeStage.company.description,
					nom: offreDeStage.company.name,
					logoUrl: offreDeStage.company.logo,
					siteUrl: offreDeStage.company.website,
				},
				localisation: {
					ville: offreDeStage.location.city,
					codePostal: offreDeStage.location.zipcode,
					departement: offreDeStage.location.department,
					region: offreDeStage.location.state,
					pays: offreDeStage.location.country,
				},
				source: UnJeune1Solution.Source.JOBTEASER,
				urlDeCandidature: offreDeStage.external_url,
				teletravailPossible: false,
				dateDeDebut: offreDeStage.start_date,
				sourceCreatedAt: offreDeStage.date_created,
				sourcePublishedAt: this.dateService.maintenant().toISOString(),
				sourceUpdatedAt: this.dateService.maintenant().toISOString(),
				remunerationBase: -1,
				identifiantSource: offreDeStage.reference,
				duree: offreDeStage.contract?.duration?.amount,
				dureeEnJour: this.traduireLaDureeEnJours(offreDeStage.contract.duration),
				dureeEnJourMax: undefined,
				domaines: this.traduireLesDomainesVers1Jeune1Solution(offreDeStage),
			};
		}

		private traduireLesDomainesVers1Jeune1Solution(offreDeStage: Jobteaser.OffreDeStage): Array<UnJeune1Solution.Domaine> {
			return Array.isArray(offreDeStage.domains.domain)
				? offreDeStage.domains.domain.map((domaine) => {
					return this.correspondanceDomaines.traduire(domaine.trim() as Jobteaser.Domaine);
				})
				: [this.correspondanceDomaines.traduire(offreDeStage.domains.domain.trim() as Jobteaser.Domaine)];
		}

		private traduireLaDureeEnJours(duree: Duree): number {
			return duree?.type
				? Number(duree?.amount) * ConvertirOffreDeStage.NOMBRE_DE_JOURS_DANS_UN_MOIS
				: Number(duree?.amount);
		}
	}

	export class CorrespondanceDomaine {
		private readonly tableDeCorrespondance: Map<Jobteaser.Domaine, UnJeune1Solution.Domaine>;

		public traduire(domaine: Jobteaser.Domaine): UnJeune1Solution.Domaine {
			const traductionDomaine = this.tableDeCorrespondance.get(domaine);
			return traductionDomaine || UnJeune1Solution.Domaine.NON_APPLICABLE;
		}

		constructor() {
			this.tableDeCorrespondance = new Map();
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ACHATS, UnJeune1Solution.Domaine.ACHATS);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ACTUARIAT, UnJeune1Solution.Domaine.CONSEIL);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ADMINISTRATIF, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.AGRONOMIE_BIOLOGIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ARCHITECTURE_URBANISME, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.AUDIOVISUEL, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.AUDIT, UnJeune1Solution.Domaine.AUDIT);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.CHIMIE_ET_PROCEDES, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.COMMERCIAL_BUSINESS_DEVELOPPEMENT, UnJeune1Solution.Domaine.COMMERCE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.COMMUNICATION_RP_EVENEMENTIEL, UnJeune1Solution.Domaine.COMMUNICATION);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.CONTROLE_GESTION_COMPTABILITE, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.DESIGN_CREATION, UnJeune1Solution.Domaine.DESIGN);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.DEVELOPPEMENT_INFORMATIQUE, UnJeune1Solution.Domaine.INFORMATIQUE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.DROITS_AFFAIRES, UnJeune1Solution.Domaine.JURIDIQUE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.DROIT_SOCIAL, UnJeune1Solution.Domaine.JURIDIQUE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ECONOMIE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.EDUCATION_FORMATION, UnJeune1Solution.Domaine.ENSEIGNEMENT);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ELECTRONIQUE_TRAITEMENT_SIGNAL, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ENERGIE_MATERIAUX_MECANIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.ENVIRONNEMENT, UnJeune1Solution.Domaine.ENVIRONNEMENT);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.FINANCE_ENTREPRISE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.FINANCE_MARCHE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.FISCALITE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.GENIE_CIVIL_STRUCTURE, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.GENIE_INDUSTRIEL_CONCEPTION, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.GESTION_ACTIFS, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.GESTION_PROJET_IT, UnJeune1Solution.Domaine.GESTION_PROJET);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.INFRA_RESEAUX_TELECOMS, UnJeune1Solution.Domaine.INFRA_RESEAUX_TELECOM);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.JOURNALISME_EDITION, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.LOGISTIQUE_SUPPLY_CHAIN, UnJeune1Solution.Domaine.LOGISTIQUE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.MANAGEMENT_CONSEIL_STRATEGIE, UnJeune1Solution.Domaine.CONSEIL);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.MARKETING_WEB_MARKETING, UnJeune1Solution.Domaine.MARKETING);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.MEDIA, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.PARAMEDICAL_SOIN, UnJeune1Solution.Domaine.SANTE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.PRODUCTION_EXPLOITATION, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.QUALITE_MAINTENANCE, UnJeune1Solution.Domaine.QUALITE_MAINTENANCE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.RESSOURCES_HUMAINES, UnJeune1Solution.Domaine.RH);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.RESTAURATION, UnJeune1Solution.Domaine.HOTELLERIE);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.SERVICE_RELATION_CLIENTS, UnJeune1Solution.Domaine.SUPPORT);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.STATISTIQUES_DATA_MATH_APP, UnJeune1Solution.Domaine.DATA);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.TRAVAUX_CHANTIER, UnJeune1Solution.Domaine.TRAVAUX);
			this.tableDeCorrespondance.set(Jobteaser.Domaine.WEBDESIGN_ERGONOMIE, UnJeune1Solution.Domaine.DESIGN);

			// this.tableDeCorrespondance.set(Jobteaser.Domaine.AGRICULTURE_SECTEUR_FORESTIER, UnJeune1Solution.Domaine.AGRICULTURE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.AGROALIMENTAIRE_BOISSONS, UnJeune1Solution.Domaine.AGRICULTURE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.ARCHITECTURE_DESIGN, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.ASSURANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.AUTOMOBILE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.AUTRE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.AUTRES_INDUSTRIES, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.AUTRES_SERVICES_ENTREPRISES_PARTICULIERS, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.BANQUE_FINANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.BTP_URBANISME, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.CHIMIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.CONSEIL, UnJeune1Solution.Domaine.CONSEIL);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.CONSEIL_STRATEGIE, UnJeune1Solution.Domaine.CONSEIL);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.DISTRIBUTION, UnJeune1Solution.Domaine.VENTES);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.ELECTRONIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.ENERGIE_UTILITIES, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.ESN, UnJeune1Solution.Domaine.INFORMATIQUE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.GRANDE_CONSO, UnJeune1Solution.Domaine.VENTES);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.IMMOBILIER, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.JURIDIQUE, UnJeune1Solution.Domaine.JURIDIQUE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.LOISIRS_CULTURE_SPORTS, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.LUXE_MODE, UnJeune1Solution.Domaine.LUXE_MODE_TEXTILE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.MEDIA_EDITION, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.PUBLIC_EDUCATION, UnJeune1Solution.Domaine.ENSEIGNEMENT);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.RECRUTEMENT_FORMATION, UnJeune1Solution.Domaine.RH);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.SERVICES_COMPTABLES, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.SOCIAL_ONG, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.SOCIAL_SERVICE_PERSONNE, UnJeune1Solution.Domaine.SANTE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.TOURISME_HOTELLERIE, UnJeune1Solution.Domaine.HOTELLERIE);
			// this.tableDeCorrespondance.set(Jobteaser.Domaine.TRANSPORT_LOGISTIQUE, UnJeune1Solution.Domaine.LOGISTIQUE);
		}
	}
}
