import {
	Contenu as _Contenu,
	Duree,
	OffreDeStage as _OffreDeStage,
} from "@transformation/domain/jobteaser/offre-de-stage";
import { Domaine as _Domaine } from "@transformation/domain/jobteaser/domaine";
import { DateService } from "@shared/date.service";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export namespace Jobteaser {
	export type Contenu = _Contenu;
	export import Domaine = _Domaine;
	export type OffreDeStage = _OffreDeStage;

	export class Convertir {
		private static NOMBRE_DE_JOURS_DANS_UN_MOIS = 30;

		constructor(
			private readonly dateService: DateService,
			private readonly correspondanceDomaines: CorrespondanceDomaine
		) {
		}

		depuisJobteaser(offreDeStage: OffreDeStage): UnJeune1Solution.OffreDeStage {
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
				dateDeDebut: offreDeStage.start_date || this.dateService.maintenant().toISOString(),
				sourceCreatedAt: offreDeStage.date_created,
				sourceUpdatedAt: offreDeStage.date_created,
				sourcePublishedAt: this.dateService.maintenant().toISOString(),
				remunerationBase: undefined,
				identifiantSource: offreDeStage.reference,
				duree: offreDeStage.contract?.duration?.amount,
				dureeEnJour: this.traduireLaDureeEnJours(offreDeStage.contract?.duration),
				dureeEnJourMax: undefined,
				domaines: this.traduireLesDomainesVers1Jeune1Solution(offreDeStage),
			};
		}

		private traduireLesDomainesVers1Jeune1Solution(offreDeStage: OffreDeStage): Array<UnJeune1Solution.Domaine> {
			return Array.isArray(offreDeStage.domains.domain)
				? offreDeStage.domains.domain.map((domaine) => {
					return this.correspondanceDomaines.traduire(domaine.trim() as Domaine);
				})
				: [this.correspondanceDomaines.traduire(offreDeStage.domains.domain.trim() as Domaine)];
		}

		private traduireLaDureeEnJours(duree?: Duree): number | undefined {
			if (!duree) {
				return undefined;
			}
			return duree.type
				? Number(duree.amount) * Convertir.NOMBRE_DE_JOURS_DANS_UN_MOIS
				: Number(duree.amount);
		}
	}

	export class CorrespondanceDomaine {
		private readonly tableDeCorrespondance: Map<Domaine, UnJeune1Solution.Domaine>;

		constructor() {
			this.tableDeCorrespondance = new Map();
			this.tableDeCorrespondance.set(Domaine.ACHATS, UnJeune1Solution.Domaine.ACHATS);
			this.tableDeCorrespondance.set(Domaine.ACTUARIAT, UnJeune1Solution.Domaine.CONSEIL);
			this.tableDeCorrespondance.set(Domaine.ADMINISTRATIF, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
			this.tableDeCorrespondance.set(Domaine.AGRONOMIE_BIOLOGIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			this.tableDeCorrespondance.set(Domaine.ARCHITECTURE_URBANISME, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			this.tableDeCorrespondance.set(Domaine.AUDIOVISUEL, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.tableDeCorrespondance.set(Domaine.AUDIT, UnJeune1Solution.Domaine.AUDIT);
			this.tableDeCorrespondance.set(Domaine.CHIMIE_ET_PROCEDES, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			this.tableDeCorrespondance.set(Domaine.COMMERCIAL_BUSINESS_DEVELOPPEMENT, UnJeune1Solution.Domaine.COMMERCE);
			this.tableDeCorrespondance.set(Domaine.COMMUNICATION_RP_EVENEMENTIEL, UnJeune1Solution.Domaine.COMMUNICATION);
			this.tableDeCorrespondance.set(Domaine.CONTROLE_GESTION_COMPTABILITE, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
			this.tableDeCorrespondance.set(Domaine.DESIGN_CREATION, UnJeune1Solution.Domaine.DESIGN);
			this.tableDeCorrespondance.set(Domaine.DEVELOPPEMENT_INFORMATIQUE, UnJeune1Solution.Domaine.INFORMATIQUE);
			this.tableDeCorrespondance.set(Domaine.DROITS_AFFAIRES, UnJeune1Solution.Domaine.JURIDIQUE);
			this.tableDeCorrespondance.set(Domaine.DROIT_SOCIAL, UnJeune1Solution.Domaine.JURIDIQUE);
			this.tableDeCorrespondance.set(Domaine.ECONOMIE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			this.tableDeCorrespondance.set(Domaine.EDUCATION_FORMATION, UnJeune1Solution.Domaine.ENSEIGNEMENT);
			this.tableDeCorrespondance.set(Domaine.ELECTRONIQUE_TRAITEMENT_SIGNAL, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			this.tableDeCorrespondance.set(Domaine.ENERGIE_MATERIAUX_MECANIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			this.tableDeCorrespondance.set(Domaine.ENVIRONNEMENT, UnJeune1Solution.Domaine.ENVIRONNEMENT);
			this.tableDeCorrespondance.set(Domaine.FINANCE_ENTREPRISE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Domaine.FINANCE_MARCHE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Domaine.FISCALITE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Domaine.GENIE_CIVIL_STRUCTURE, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
			this.tableDeCorrespondance.set(Domaine.GENIE_INDUSTRIEL_CONCEPTION, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
			this.tableDeCorrespondance.set(Domaine.GESTION_ACTIFS, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.tableDeCorrespondance.set(Domaine.GESTION_PROJET_IT, UnJeune1Solution.Domaine.GESTION_PROJET);
			this.tableDeCorrespondance.set(Domaine.INFRA_RESEAUX_TELECOMS, UnJeune1Solution.Domaine.INFRA_RESEAUX_TELECOM);
			this.tableDeCorrespondance.set(Domaine.JOURNALISME_EDITION, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.tableDeCorrespondance.set(Domaine.LOGISTIQUE_SUPPLY_CHAIN, UnJeune1Solution.Domaine.LOGISTIQUE);
			this.tableDeCorrespondance.set(Domaine.MANAGEMENT_CONSEIL_STRATEGIE, UnJeune1Solution.Domaine.CONSEIL);
			this.tableDeCorrespondance.set(Domaine.MARKETING_WEB_MARKETING, UnJeune1Solution.Domaine.MARKETING);
			this.tableDeCorrespondance.set(Domaine.MEDIA, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.tableDeCorrespondance.set(Domaine.PARAMEDICAL_SOIN, UnJeune1Solution.Domaine.SANTE);
			this.tableDeCorrespondance.set(Domaine.PRODUCTION_EXPLOITATION, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
			this.tableDeCorrespondance.set(Domaine.QUALITE_MAINTENANCE, UnJeune1Solution.Domaine.QUALITE_MAINTENANCE);
			this.tableDeCorrespondance.set(Domaine.RESSOURCES_HUMAINES, UnJeune1Solution.Domaine.RH);
			this.tableDeCorrespondance.set(Domaine.RESTAURATION, UnJeune1Solution.Domaine.HOTELLERIE);
			this.tableDeCorrespondance.set(Domaine.SERVICE_RELATION_CLIENTS, UnJeune1Solution.Domaine.SUPPORT);
			this.tableDeCorrespondance.set(Domaine.STATISTIQUES_DATA_MATH_APP, UnJeune1Solution.Domaine.DATA);
			this.tableDeCorrespondance.set(Domaine.TRAVAUX_CHANTIER, UnJeune1Solution.Domaine.TRAVAUX);
			this.tableDeCorrespondance.set(Domaine.WEBDESIGN_ERGONOMIE, UnJeune1Solution.Domaine.DESIGN);

			// this.tableDeCorrespondance.set(Domaine.AGRICULTURE_SECTEUR_FORESTIER, UnJeune1Solution.Domaine.AGRICULTURE);
			// this.tableDeCorrespondance.set(Domaine.AGROALIMENTAIRE_BOISSONS, UnJeune1Solution.Domaine.AGRICULTURE);
			// this.tableDeCorrespondance.set(Domaine.ARCHITECTURE_DESIGN, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.tableDeCorrespondance.set(Domaine.ASSURANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			// this.tableDeCorrespondance.set(Domaine.AUTOMOBILE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Domaine.AUTRE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Domaine.AUTRES_INDUSTRIES, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Domaine.AUTRES_SERVICES_ENTREPRISES_PARTICULIERS, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.tableDeCorrespondance.set(Domaine.BANQUE_FINANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			// this.tableDeCorrespondance.set(Domaine.BTP_URBANISME, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.tableDeCorrespondance.set(Domaine.CHIMIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			// this.tableDeCorrespondance.set(Domaine.CONSEIL, UnJeune1Solution.Domaine.CONSEIL);
			// this.tableDeCorrespondance.set(Domaine.CONSEIL_STRATEGIE, UnJeune1Solution.Domaine.CONSEIL);
			// this.tableDeCorrespondance.set(Domaine.DISTRIBUTION, UnJeune1Solution.Domaine.VENTES);
			// this.tableDeCorrespondance.set(Domaine.ELECTRONIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			// this.tableDeCorrespondance.set(Domaine.ENERGIE_UTILITIES, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			// this.tableDeCorrespondance.set(Domaine.ESN, UnJeune1Solution.Domaine.INFORMATIQUE);
			// this.tableDeCorrespondance.set(Domaine.GRANDE_CONSO, UnJeune1Solution.Domaine.VENTES);
			// this.tableDeCorrespondance.set(Domaine.IMMOBILIER, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.tableDeCorrespondance.set(Domaine.JURIDIQUE, UnJeune1Solution.Domaine.JURIDIQUE);
			// this.tableDeCorrespondance.set(Domaine.LOISIRS_CULTURE_SPORTS, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
			// this.tableDeCorrespondance.set(Domaine.LUXE_MODE, UnJeune1Solution.Domaine.LUXE_MODE_TEXTILE);
			// this.tableDeCorrespondance.set(Domaine.MEDIA_EDITION, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			// this.tableDeCorrespondance.set(Domaine.PUBLIC_EDUCATION, UnJeune1Solution.Domaine.ENSEIGNEMENT);
			// this.tableDeCorrespondance.set(Domaine.RECRUTEMENT_FORMATION, UnJeune1Solution.Domaine.RH);
			// this.tableDeCorrespondance.set(Domaine.SERVICES_COMPTABLES, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
			// this.tableDeCorrespondance.set(Domaine.SOCIAL_ONG, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
			// this.tableDeCorrespondance.set(Domaine.SOCIAL_SERVICE_PERSONNE, UnJeune1Solution.Domaine.SANTE);
			// this.tableDeCorrespondance.set(Domaine.TOURISME_HOTELLERIE, UnJeune1Solution.Domaine.HOTELLERIE);
			// this.tableDeCorrespondance.set(Domaine.TRANSPORT_LOGISTIQUE, UnJeune1Solution.Domaine.LOGISTIQUE);
		}

		public traduire(domaine: Domaine): UnJeune1Solution.Domaine {
			const traductionDomaine = this.tableDeCorrespondance.get(domaine);
			return traductionDomaine || UnJeune1Solution.Domaine.NON_APPLICABLE;
		}
	}
}
