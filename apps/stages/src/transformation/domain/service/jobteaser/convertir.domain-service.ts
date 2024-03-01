import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";
import { Pays } from "@shared/src/domain/service/pays";

import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { Jobteaser } from "@stages/src/transformation/domain/model/jobteaser";

export class Convertir {
	private static NOMBRE_DE_JOURS_DANS_UN_MOIS_POUR_CALCUL = 30;
	private readonly correspondanceDomaines: Map<Jobteaser.Domaine, UnJeune1Solution.Domaine>;

	constructor(
		private readonly dateService: DateService,
		private readonly assainisseurDeTexte: AssainisseurDeTexte,
		private readonly pays: Pays,
	) {
		this.correspondanceDomaines = new Map();
		this.correspondanceDomaines.set(Jobteaser.Domaine.ACHATS, UnJeune1Solution.Domaine.ACHATS);
		this.correspondanceDomaines.set(Jobteaser.Domaine.ACTUARIAT, UnJeune1Solution.Domaine.CONSEIL);
		this.correspondanceDomaines.set(Jobteaser.Domaine.ADMINISTRATIF, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
		this.correspondanceDomaines.set(Jobteaser.Domaine.AGRONOMIE_BIOLOGIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.ARCHITECTURE_URBANISME, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
		this.correspondanceDomaines.set(Jobteaser.Domaine.AUDIOVISUEL, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
		this.correspondanceDomaines.set(Jobteaser.Domaine.AUDIT, UnJeune1Solution.Domaine.AUDIT);
		this.correspondanceDomaines.set(Jobteaser.Domaine.CHIMIE_ET_PROCEDES, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.COMMERCIAL_BUSINESS_DEVELOPPEMENT, UnJeune1Solution.Domaine.COMMERCE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.COMMUNICATION_RP_EVENEMENTIEL, UnJeune1Solution.Domaine.COMMUNICATION);
		this.correspondanceDomaines.set(Jobteaser.Domaine.CONTROLE_GESTION_COMPTABILITE, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
		this.correspondanceDomaines.set(Jobteaser.Domaine.DESIGN_CREATION, UnJeune1Solution.Domaine.DESIGN);
		this.correspondanceDomaines.set(Jobteaser.Domaine.DEVELOPPEMENT_INFORMATIQUE, UnJeune1Solution.Domaine.INFORMATIQUE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.DROITS_AFFAIRES, UnJeune1Solution.Domaine.JURIDIQUE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.DROIT_SOCIAL, UnJeune1Solution.Domaine.JURIDIQUE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.ECONOMIE, UnJeune1Solution.Domaine.NON_APPLICABLE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.EDUCATION_FORMATION, UnJeune1Solution.Domaine.ENSEIGNEMENT);
		this.correspondanceDomaines.set(Jobteaser.Domaine.ELECTRONIQUE_TRAITEMENT_SIGNAL, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.ENERGIE_MATERIAUX_MECANIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.ENVIRONNEMENT, UnJeune1Solution.Domaine.ENVIRONNEMENT);
		this.correspondanceDomaines.set(Jobteaser.Domaine.FINANCE_ENTREPRISE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.FINANCE_MARCHE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.FISCALITE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.GENIE_CIVIL_STRUCTURE, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
		this.correspondanceDomaines.set(Jobteaser.Domaine.GENIE_INDUSTRIEL_CONCEPTION, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
		this.correspondanceDomaines.set(Jobteaser.Domaine.GESTION_ACTIFS, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.GESTION_PROJET_IT, UnJeune1Solution.Domaine.GESTION_PROJET);
		this.correspondanceDomaines.set(Jobteaser.Domaine.INFRA_RESEAUX_TELECOMS, UnJeune1Solution.Domaine.INFRA_RESEAUX_TELECOM);
		this.correspondanceDomaines.set(Jobteaser.Domaine.JOURNALISME_EDITION, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
		this.correspondanceDomaines.set(Jobteaser.Domaine.LOGISTIQUE_SUPPLY_CHAIN, UnJeune1Solution.Domaine.LOGISTIQUE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.MANAGEMENT_CONSEIL_STRATEGIE, UnJeune1Solution.Domaine.CONSEIL);
		this.correspondanceDomaines.set(Jobteaser.Domaine.MARKETING_WEB_MARKETING, UnJeune1Solution.Domaine.MARKETING);
		this.correspondanceDomaines.set(Jobteaser.Domaine.MEDIA, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
		this.correspondanceDomaines.set(Jobteaser.Domaine.PARAMEDICAL_SOIN, UnJeune1Solution.Domaine.SANTE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.PRODUCTION_EXPLOITATION, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
		this.correspondanceDomaines.set(Jobteaser.Domaine.QUALITE_MAINTENANCE, UnJeune1Solution.Domaine.QUALITE_MAINTENANCE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.RESSOURCES_HUMAINES, UnJeune1Solution.Domaine.RH);
		this.correspondanceDomaines.set(Jobteaser.Domaine.RESTAURATION, UnJeune1Solution.Domaine.HOTELLERIE);
		this.correspondanceDomaines.set(Jobteaser.Domaine.SERVICE_RELATION_CLIENTS, UnJeune1Solution.Domaine.SUPPORT);
		this.correspondanceDomaines.set(Jobteaser.Domaine.STATISTIQUES_DATA_MATH_APP, UnJeune1Solution.Domaine.DATA);
		this.correspondanceDomaines.set(Jobteaser.Domaine.TRAVAUX_CHANTIER, UnJeune1Solution.Domaine.TRAVAUX);
		this.correspondanceDomaines.set(Jobteaser.Domaine.WEBDESIGN_ERGONOMIE, UnJeune1Solution.Domaine.DESIGN);
	}

	public depuisJobteaser(offreDeStage: Jobteaser.OffreDeStage): UnJeune1Solution.OffreDeStage {
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
			dateDeDebutMin: offreDeStage.start_date || maintenant,
			dateDeDebutMax: offreDeStage.start_date || maintenant,
			sourceCreatedAt: offreDeStage.date_created,
			sourceUpdatedAt: offreDeStage.date_created,
			sourcePublishedAt: maintenant,
			remunerationBase: undefined,
			salaireMin: undefined,
			salaireMax: undefined,
			periodeSalaire: undefined,
			identifiantSource: offreDeStage.reference,
			dureeEnJour: this.traduireLaDureeEnJours(offreDeStage.contract?.duration),
			dureeEnJourMax: undefined,
			domaines: this.traduireLesDomainesVers1Jeune1Solution(offreDeStage),
		};
	}

	private extraireEmployeur(employeur: Jobteaser.Employeur): UnJeune1Solution.Employeur {
		return {
			description: employeur.description ? this.assainisseurDeTexte.nettoyer(employeur.description) : undefined,
			nom: this.assainisseurDeTexte.nettoyer(employeur.name.toString()),
			logoUrl: employeur.logo,
			siteUrl: employeur.website,
		};
	}

	private traduireDomaine(domaine: Jobteaser.Domaine): UnJeune1Solution.Domaine {
		const traductionDomaine = this.correspondanceDomaines.get(domaine);
		return traductionDomaine || UnJeune1Solution.Domaine.NON_APPLICABLE;
	}

	private traduireLesDomainesVers1Jeune1Solution(offreDeStage: Jobteaser.OffreDeStage): Array<{ nom: UnJeune1Solution.Domaine }> {
		return Array.isArray(offreDeStage.domains.domain)
			? offreDeStage.domains.domain.map((domaine) => {
				return { nom: this.traduireDomaine(domaine.trim() as Jobteaser.Domaine) };
			})
			: [{ nom: this.traduireDomaine(offreDeStage.domains.domain.trim() as Jobteaser.Domaine) }];
	}

	private traduireLaDureeEnJours(duree?: Jobteaser.Duree): number | undefined {
		if (!duree) {
			return undefined;
		}
		if (duree.type) {
			return Number(duree.amount) * Convertir.NOMBRE_DE_JOURS_DANS_UN_MOIS_POUR_CALCUL;
		}
		return Number(duree.amount);
	}
}
