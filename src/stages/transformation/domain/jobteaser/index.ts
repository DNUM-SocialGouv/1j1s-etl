import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import {
	Contenu as _Contenu,
	Duree,
	Employeur as _Employeur,
	Localisation as _Localisation,
	OffreDeStage as _OffreDeStage,
} from "@stages/transformation/domain/jobteaser/offre-de-stage";
import { DateService } from "@shared/date.service";
import { Domaine as _Domaine } from "@stages/transformation/domain/jobteaser/domaine";
import { Pays } from "@shared/pays";
import { UnJeune1Solution } from "@stages/transformation/domain/1jeune1solution";

export namespace Jobteaser {
	export type Contenu = _Contenu;
	export import Domaine = _Domaine;
	export type Employeur = _Employeur;
	export type Localisation = _Localisation;
	export type OffreDeStage = _OffreDeStage;

	export class Convertir {
		private static NOMBRE_DE_JOURS_DANS_UN_MOIS_POUR_CALCUL = 30;
		private readonly correspondanceDomaines: Map<Domaine, UnJeune1Solution.Domaine>;

		constructor(
			private readonly dateService: DateService,
			private readonly assainisseurDeTexte: AssainisseurDeTexte,
			private readonly pays: Pays,
		) {
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
		}

		public depuisJobteaser(offreDeStage: OffreDeStage): UnJeune1Solution.OffreDeStage {
			const maintenant = this.dateService.maintenant().toISOString();

			return {
				titre: offreDeStage.title,
				description: this.assainisseurDeTexte.nettoyer(offreDeStage.mission),
				employeur: this.extraireEmployeur(offreDeStage.company),
				localisation: {
					ville: offreDeStage.location.city,
					codePostal: String(offreDeStage.location.zipcode),
					departement: offreDeStage.location.department,
					region: offreDeStage.location.state,
					pays: this.pays.versFormatISOAlpha2(offreDeStage.location.country),
				},
				source: UnJeune1Solution.Source.JOBTEASER,
				urlDeCandidature: offreDeStage.external_url,
				teletravailPossible: undefined,
				dateDeDebut: offreDeStage.start_date || maintenant,
				sourceCreatedAt: offreDeStage.date_created,
				sourceUpdatedAt: offreDeStage.date_created,
				sourcePublishedAt: maintenant,
				remunerationBase: undefined,
				identifiantSource: offreDeStage.reference,
				dureeEnJour: this.traduireLaDureeEnJours(offreDeStage.contract?.duration),
				dureeEnJourMax: undefined,
				domaines: this.traduireLesDomainesVers1Jeune1Solution(offreDeStage),
			};
		}

		private extraireEmployeur(employeur: Jobteaser.Employeur): UnJeune1Solution.Employeur {
			return {
				description: employeur.description ? this.assainisseurDeTexte.nettoyer(employeur.description) : undefined,
				nom: this.assainisseurDeTexte.nettoyer(employeur.name),
				logoUrl: employeur.logo,
				siteUrl: employeur.website,
			};
		}

		private traduireDomaine(domaine: Domaine): UnJeune1Solution.Domaine {
			const traductionDomaine = this.correspondanceDomaines.get(domaine);
			return traductionDomaine || UnJeune1Solution.Domaine.NON_APPLICABLE;
		}

		private traduireLesDomainesVers1Jeune1Solution(offreDeStage: OffreDeStage): Array<{ nom: UnJeune1Solution.Domaine }> {
			return Array.isArray(offreDeStage.domains.domain)
				? offreDeStage.domains.domain.map((domaine) => {
					return { nom: this.traduireDomaine(domaine.trim() as Domaine) };
				})
				: [{ nom: this.traduireDomaine(offreDeStage.domains.domain.trim() as Domaine) }];
		}

		private traduireLaDureeEnJours(duree?: Duree): number | undefined {
			if (!duree) {
				return undefined;
			}
			if (duree.type) {
				return Number(duree.amount) * Convertir.NOMBRE_DE_JOURS_DANS_UN_MOIS_POUR_CALCUL;
			}
			return Number(duree.amount);
		}
	}
}
