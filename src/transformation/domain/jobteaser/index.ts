import {
	Contenu as _Contenu,
	Duree,
	OffreDeStage as _OffreDeStage,
} from "@transformation/domain/jobteaser/offre-de-stage";
import { DateService } from "@shared/date.service";
import { Domaine as _Domaine } from "@transformation/domain/jobteaser/domaine";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export namespace Jobteaser {
	export type Contenu = _Contenu;
	export import Domaine = _Domaine;
	export type OffreDeStage = _OffreDeStage;

	export class Convertir {
		private static NOMBRE_DE_JOURS_DANS_UN_MOIS = 30;
		private readonly correspondanceDomaines: Map<Domaine, UnJeune1Solution.Domaine>;

		constructor(private readonly dateService: DateService) {
			this.correspondanceDomaines = new Map();
			this.correspondanceDomaines.set(Domaine.ACHATS, UnJeune1Solution.Domaine.ACHATS);
			this.correspondanceDomaines.set(Domaine.ACTUARIAT, UnJeune1Solution.Domaine.CONSEIL);
			this.correspondanceDomaines.set(Domaine.ADMINISTRATIF, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
			this.correspondanceDomaines.set(Domaine.AGRONOMIE_BIOLOGIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			this.correspondanceDomaines.set(Domaine.ARCHITECTURE_URBANISME, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			this.correspondanceDomaines.set(Domaine.AUDIOVISUEL, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.correspondanceDomaines.set(Domaine.AUDIT, UnJeune1Solution.Domaine.AUDIT);
			this.correspondanceDomaines.set(Domaine.CHIMIE_ET_PROCEDES, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			this.correspondanceDomaines.set(Domaine.COMMERCIAL_BUSINESS_DEVELOPPEMENT, UnJeune1Solution.Domaine.COMMERCE);
			this.correspondanceDomaines.set(Domaine.COMMUNICATION_RP_EVENEMENTIEL, UnJeune1Solution.Domaine.COMMUNICATION);
			this.correspondanceDomaines.set(Domaine.CONTROLE_GESTION_COMPTABILITE, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
			this.correspondanceDomaines.set(Domaine.DESIGN_CREATION, UnJeune1Solution.Domaine.DESIGN);
			this.correspondanceDomaines.set(Domaine.DEVELOPPEMENT_INFORMATIQUE, UnJeune1Solution.Domaine.INFORMATIQUE);
			this.correspondanceDomaines.set(Domaine.DROITS_AFFAIRES, UnJeune1Solution.Domaine.JURIDIQUE);
			this.correspondanceDomaines.set(Domaine.DROIT_SOCIAL, UnJeune1Solution.Domaine.JURIDIQUE);
			this.correspondanceDomaines.set(Domaine.ECONOMIE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			this.correspondanceDomaines.set(Domaine.EDUCATION_FORMATION, UnJeune1Solution.Domaine.ENSEIGNEMENT);
			this.correspondanceDomaines.set(Domaine.ELECTRONIQUE_TRAITEMENT_SIGNAL, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			this.correspondanceDomaines.set(Domaine.ENERGIE_MATERIAUX_MECANIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			this.correspondanceDomaines.set(Domaine.ENVIRONNEMENT, UnJeune1Solution.Domaine.ENVIRONNEMENT);
			this.correspondanceDomaines.set(Domaine.FINANCE_ENTREPRISE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.correspondanceDomaines.set(Domaine.FINANCE_MARCHE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.correspondanceDomaines.set(Domaine.FISCALITE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.correspondanceDomaines.set(Domaine.GENIE_CIVIL_STRUCTURE, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
			this.correspondanceDomaines.set(Domaine.GENIE_INDUSTRIEL_CONCEPTION, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
			this.correspondanceDomaines.set(Domaine.GESTION_ACTIFS, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			this.correspondanceDomaines.set(Domaine.GESTION_PROJET_IT, UnJeune1Solution.Domaine.GESTION_PROJET);
			this.correspondanceDomaines.set(Domaine.INFRA_RESEAUX_TELECOMS, UnJeune1Solution.Domaine.INFRA_RESEAUX_TELECOM);
			this.correspondanceDomaines.set(Domaine.JOURNALISME_EDITION, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.correspondanceDomaines.set(Domaine.LOGISTIQUE_SUPPLY_CHAIN, UnJeune1Solution.Domaine.LOGISTIQUE);
			this.correspondanceDomaines.set(Domaine.MANAGEMENT_CONSEIL_STRATEGIE, UnJeune1Solution.Domaine.CONSEIL);
			this.correspondanceDomaines.set(Domaine.MARKETING_WEB_MARKETING, UnJeune1Solution.Domaine.MARKETING);
			this.correspondanceDomaines.set(Domaine.MEDIA, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			this.correspondanceDomaines.set(Domaine.PARAMEDICAL_SOIN, UnJeune1Solution.Domaine.SANTE);
			this.correspondanceDomaines.set(Domaine.PRODUCTION_EXPLOITATION, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
			this.correspondanceDomaines.set(Domaine.QUALITE_MAINTENANCE, UnJeune1Solution.Domaine.QUALITE_MAINTENANCE);
			this.correspondanceDomaines.set(Domaine.RESSOURCES_HUMAINES, UnJeune1Solution.Domaine.RH);
			this.correspondanceDomaines.set(Domaine.RESTAURATION, UnJeune1Solution.Domaine.HOTELLERIE);
			this.correspondanceDomaines.set(Domaine.SERVICE_RELATION_CLIENTS, UnJeune1Solution.Domaine.SUPPORT);
			this.correspondanceDomaines.set(Domaine.STATISTIQUES_DATA_MATH_APP, UnJeune1Solution.Domaine.DATA);
			this.correspondanceDomaines.set(Domaine.TRAVAUX_CHANTIER, UnJeune1Solution.Domaine.TRAVAUX);
			this.correspondanceDomaines.set(Domaine.WEBDESIGN_ERGONOMIE, UnJeune1Solution.Domaine.DESIGN);

			// this.correspondanceDomaines.set(Domaine.AGRICULTURE_SECTEUR_FORESTIER, UnJeune1Solution.Domaine.AGRICULTURE);
			// this.correspondanceDomaines.set(Domaine.AGROALIMENTAIRE_BOISSONS, UnJeune1Solution.Domaine.AGRICULTURE);
			// this.correspondanceDomaines.set(Domaine.ARCHITECTURE_DESIGN, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.correspondanceDomaines.set(Domaine.ASSURANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			// this.correspondanceDomaines.set(Domaine.AUTOMOBILE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.correspondanceDomaines.set(Domaine.AUTRE, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.correspondanceDomaines.set(Domaine.AUTRES_INDUSTRIES, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.correspondanceDomaines.set(Domaine.AUTRES_SERVICES_ENTREPRISES_PARTICULIERS, UnJeune1Solution.Domaine.NON_APPLICABLE);
			// this.correspondanceDomaines.set(Domaine.BANQUE_FINANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
			// this.correspondanceDomaines.set(Domaine.BTP_URBANISME, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.correspondanceDomaines.set(Domaine.CHIMIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
			// this.correspondanceDomaines.set(Domaine.CONSEIL, UnJeune1Solution.Domaine.CONSEIL);
			// this.correspondanceDomaines.set(Domaine.CONSEIL_STRATEGIE, UnJeune1Solution.Domaine.CONSEIL);
			// this.correspondanceDomaines.set(Domaine.DISTRIBUTION, UnJeune1Solution.Domaine.VENTES);
			// this.correspondanceDomaines.set(Domaine.ELECTRONIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			// this.correspondanceDomaines.set(Domaine.ENERGIE_UTILITIES, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
			// this.correspondanceDomaines.set(Domaine.ESN, UnJeune1Solution.Domaine.INFORMATIQUE);
			// this.correspondanceDomaines.set(Domaine.GRANDE_CONSO, UnJeune1Solution.Domaine.VENTES);
			// this.correspondanceDomaines.set(Domaine.IMMOBILIER, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
			// this.correspondanceDomaines.set(Domaine.JURIDIQUE, UnJeune1Solution.Domaine.JURIDIQUE);
			// this.correspondanceDomaines.set(Domaine.LOISIRS_CULTURE_SPORTS, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
			// this.correspondanceDomaines.set(Domaine.LUXE_MODE, UnJeune1Solution.Domaine.LUXE_MODE_TEXTILE);
			// this.correspondanceDomaines.set(Domaine.MEDIA_EDITION, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
			// this.correspondanceDomaines.set(Domaine.PUBLIC_EDUCATION, UnJeune1Solution.Domaine.ENSEIGNEMENT);
			// this.correspondanceDomaines.set(Domaine.RECRUTEMENT_FORMATION, UnJeune1Solution.Domaine.RH);
			// this.correspondanceDomaines.set(Domaine.SERVICES_COMPTABLES, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
			// this.correspondanceDomaines.set(Domaine.SOCIAL_ONG, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
			// this.correspondanceDomaines.set(Domaine.SOCIAL_SERVICE_PERSONNE, UnJeune1Solution.Domaine.SANTE);
			// this.correspondanceDomaines.set(Domaine.TOURISME_HOTELLERIE, UnJeune1Solution.Domaine.HOTELLERIE);
			// this.correspondanceDomaines.set(Domaine.TRANSPORT_LOGISTIQUE, UnJeune1Solution.Domaine.LOGISTIQUE);
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
				teletravailPossible: undefined,
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

		private traduireDomaine(domaine: Domaine): UnJeune1Solution.Domaine {
			const traductionDomaine = this.correspondanceDomaines.get(domaine);
			return traductionDomaine || UnJeune1Solution.Domaine.NON_APPLICABLE;
		}

		private traduireLesDomainesVers1Jeune1Solution(offreDeStage: OffreDeStage): Array<UnJeune1Solution.Domaine> {
			return Array.isArray(offreDeStage.domains.domain)
				? offreDeStage.domains.domain.map((domaine) => {
					return this.traduireDomaine(domaine.trim() as Domaine);
				})
				: [this.traduireDomaine(offreDeStage.domains.domain.trim() as Domaine)];
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
}