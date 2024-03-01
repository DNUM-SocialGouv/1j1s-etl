import { DateService } from "@shared/src/domain/service/date.service";
import { Pays } from "@shared/src/domain/service/pays";

import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { Hellowork } from "@stages/src/transformation/domain/model/hellowork";

type SalaireDetail = {
	periodeSalaire: UnJeune1Solution.PeriodeSalaire
	salaireMin: UnJeune1Solution.OffreDeStage["salaireMin"]
	salaireMax: UnJeune1Solution.OffreDeStage["salaireMax"]
}

export class Convertir {
	private readonly correspondanceDomaines: Map<Hellowork.Domaine, UnJeune1Solution.Domaine>;

	constructor(
		private readonly dateService: DateService,
		private readonly pays: Pays,
	) {
		this.correspondanceDomaines = new Map();
		this.correspondanceDomaines.set(Hellowork.Domaine.MARKETING, UnJeune1Solution.Domaine.MARKETING);
		this.correspondanceDomaines.set(Hellowork.Domaine.INFORMATIQUE, UnJeune1Solution.Domaine.INFORMATIQUE);
		this.correspondanceDomaines.set(Hellowork.Domaine.RESSOURCES_HUMAINES, UnJeune1Solution.Domaine.RH);
		this.correspondanceDomaines.set(Hellowork.Domaine.COMMERCE, UnJeune1Solution.Domaine.COMMERCE);
		this.correspondanceDomaines.set(Hellowork.Domaine.NULL, UnJeune1Solution.Domaine.NON_APPLICABLE);
		this.correspondanceDomaines.set(Hellowork.Domaine.COMMUNICATION, UnJeune1Solution.Domaine.COMMUNICATION);
		this.correspondanceDomaines.set(Hellowork.Domaine.JURIDIQUE, UnJeune1Solution.Domaine.JURIDIQUE);
		this.correspondanceDomaines.set(Hellowork.Domaine.FINANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
		this.correspondanceDomaines.set(Hellowork.Domaine.IMMOBILIER, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
		this.correspondanceDomaines.set(Hellowork.Domaine.LOGISTIQUE, UnJeune1Solution.Domaine.LOGISTIQUE);
		this.correspondanceDomaines.set(Hellowork.Domaine.INGENIERIE, UnJeune1Solution.Domaine.CONCEPTION_GENIE_CIVIL_INDUSTRIEL);
		this.correspondanceDomaines.set(Hellowork.Domaine.SECRETARIAT, UnJeune1Solution.Domaine.DIRECTION_ENTREPRISE);
		this.correspondanceDomaines.set(Hellowork.Domaine.QUALITE, UnJeune1Solution.Domaine.QUALITE_MAINTENANCE);
		this.correspondanceDomaines.set(Hellowork.Domaine.AUDIT, UnJeune1Solution.Domaine.AUDIT);
		this.correspondanceDomaines.set(Hellowork.Domaine.GESTION, UnJeune1Solution.Domaine.GESTION_PROJET);
		this.correspondanceDomaines.set(Hellowork.Domaine.PRODUCTION, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
		this.correspondanceDomaines.set(Hellowork.Domaine.RECHERCHE, UnJeune1Solution.Domaine.DATA);
		this.correspondanceDomaines.set(Hellowork.Domaine.VENTE, UnJeune1Solution.Domaine.VENTES);
		this.correspondanceDomaines.set(Hellowork.Domaine.ACHAT, UnJeune1Solution.Domaine.ACHATS);
		this.correspondanceDomaines.set(Hellowork.Domaine.COMPTABILITE, UnJeune1Solution.Domaine.COMPTABILITE_CONTROLE_GESTION);
		this.correspondanceDomaines.set(Hellowork.Domaine.SANTE, UnJeune1Solution.Domaine.SANTE);
		this.correspondanceDomaines.set(Hellowork.Domaine.IMMOBILIER, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
		this.correspondanceDomaines.set(Hellowork.Domaine.INDUSTRIE, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
		this.correspondanceDomaines.set(Hellowork.Domaine.GRAPHISME, UnJeune1Solution.Domaine.GRAPHISME);
		this.correspondanceDomaines.set(Hellowork.Domaine.DISTRIBUTION, UnJeune1Solution.Domaine.ACHATS);
		this.correspondanceDomaines.set(Hellowork.Domaine.ADMINISTRATIF, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
		this.correspondanceDomaines.set(Hellowork.Domaine.SAV, UnJeune1Solution.Domaine.SUPPORT);
		this.correspondanceDomaines.set(Hellowork.Domaine.SECURITE, UnJeune1Solution.Domaine.SANTE);
		this.correspondanceDomaines.set(Hellowork.Domaine.ENVIRONNEMENT, UnJeune1Solution.Domaine.ENVIRONNEMENT);
		this.correspondanceDomaines.set(Hellowork.Domaine.DIRECTION, UnJeune1Solution.Domaine.DIRECTION_ENTREPRISE);
		this.correspondanceDomaines.set(Hellowork.Domaine.BANQUE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
		this.correspondanceDomaines.set(Hellowork.Domaine.FORMATION, UnJeune1Solution.Domaine.RH);
		this.correspondanceDomaines.set(Hellowork.Domaine.AUTOMOBILE, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
		this.correspondanceDomaines.set(Hellowork.Domaine.EDITION, UnJeune1Solution.Domaine.NON_APPLICABLE);
		this.correspondanceDomaines.set(Hellowork.Domaine.RESTAURATION, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
		this.correspondanceDomaines.set(Hellowork.Domaine.TELECOM, UnJeune1Solution.Domaine.LOGISTIQUE);
		this.correspondanceDomaines.set(Hellowork.Domaine.PUB, UnJeune1Solution.Domaine.HOTELLERIE);
		this.correspondanceDomaines.set(Hellowork.Domaine.ELECTRONIQUE, UnJeune1Solution.Domaine.ENERGIE_MATERIAUX_MECANIQUE_ELECTRONIQUE);
		this.correspondanceDomaines.set(Hellowork.Domaine.HOTELLERIE, UnJeune1Solution.Domaine.HOTELLERIE);
		this.correspondanceDomaines.set(Hellowork.Domaine.SERVICE_PUBLIC, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
		this.correspondanceDomaines.set(Hellowork.Domaine.ARCHITECTURE, UnJeune1Solution.Domaine.ARCHITECTURE_URBANISME_IMMOBILIER);
		this.correspondanceDomaines.set(Hellowork.Domaine.HOSPITALIER, UnJeune1Solution.Domaine.SANTE);
		this.correspondanceDomaines.set(Hellowork.Domaine.CHIMIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
		this.correspondanceDomaines.set(Hellowork.Domaine.TRANSPORT, UnJeune1Solution.Domaine.LOGISTIQUE);
		this.correspondanceDomaines.set(Hellowork.Domaine.TOURISME, UnJeune1Solution.Domaine.HOTELLERIE);
		this.correspondanceDomaines.set(Hellowork.Domaine.SERVICE, UnJeune1Solution.Domaine.NON_APPLICABLE);
		this.correspondanceDomaines.set(Hellowork.Domaine.AGRICOLE, UnJeune1Solution.Domaine.AGRICULTURE);
		this.correspondanceDomaines.set(Hellowork.Domaine.AUDIOVISUEL, UnJeune1Solution.Domaine.JOURNALISME_RP_MEDIAS);
		this.correspondanceDomaines.set(Hellowork.Domaine.NETTOYAGE, UnJeune1Solution.Domaine.SANTE);
		this.correspondanceDomaines.set(Hellowork.Domaine.AGROALIMENTAIRE, UnJeune1Solution.Domaine.AGRICULTURE);
		this.correspondanceDomaines.set(Hellowork.Domaine.SOCIAL, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
		this.correspondanceDomaines.set(Hellowork.Domaine.BEAUTE, UnJeune1Solution.Domaine.SANTE);
		this.correspondanceDomaines.set(Hellowork.Domaine.ARTISANAT, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
		this.correspondanceDomaines.set(Hellowork.Domaine.CULTURE, UnJeune1Solution.Domaine.ACTIVITES_SOCIALES_CULTURELLES);
		this.correspondanceDomaines.set(Hellowork.Domaine.ENSEIGNEMENT, UnJeune1Solution.Domaine.ENSEIGNEMENT);
		this.correspondanceDomaines.set(Hellowork.Domaine.BIOTECHNOLOGIE, UnJeune1Solution.Domaine.CHIMIE_BIOLOGIE_AGRONOMIE);
		this.correspondanceDomaines.set(Hellowork.Domaine.ASSURANCE, UnJeune1Solution.Domaine.FISCALITE_FINANCE_ASSURANCE);
		this.correspondanceDomaines.set(Hellowork.Domaine.AERONAUTIQUE, UnJeune1Solution.Domaine.PRODUCTION_FABRICATION_EXPLOITATION);
		this.correspondanceDomaines.set(Hellowork.Domaine.NAUTISME, UnJeune1Solution.Domaine.NON_APPLICABLE);
		this.correspondanceDomaines.set(Hellowork.Domaine.DEFENSE, UnJeune1Solution.Domaine.SECTEUR_PUBLIC);
		this.correspondanceDomaines.set(Hellowork.Domaine.FERROVIAIRE, UnJeune1Solution.Domaine.LOGISTIQUE);
	}

	public depuisHellowork(offreDeStage: Hellowork.OffreDeStage): UnJeune1Solution.OffreDeStage {
		const maintenant = this.dateService.maintenant().toISOString();

		const salaire = this.mapToRemuneration(offreDeStage.salary_details);
		return {
			dateDeDebutMax: undefined,
			dateDeDebutMin: undefined,
			description: offreDeStage.description,
			domaines: [{ nom: this.mapDomaine(offreDeStage.seodomain) }],
			employeur: {
				nom: offreDeStage.company,
				logoUrl: offreDeStage.logo,
			},
			identifiantSource: offreDeStage.id.toString(),
			localisation: this.mapLocalisation(offreDeStage),
			salaireMax: salaire.salaireMax,
			salaireMin: salaire.salaireMin,
			periodeSalaire: salaire.periodeSalaire,
			source: UnJeune1Solution.Source.HELLOWORK,
			sourceCreatedAt: offreDeStage.date,
			sourceUpdatedAt: offreDeStage.date,
			sourcePublishedAt: maintenant,
			titre: offreDeStage.title,
			urlDeCandidature: offreDeStage.link,
		};
	}

	private mapDomaine(domaine: Hellowork.Domaine): UnJeune1Solution.Domaine {
		const traductionDomaine = this.correspondanceDomaines.get(domaine);
		return traductionDomaine || UnJeune1Solution.Domaine.NON_APPLICABLE;
	}

	private mapLocalisation(offreDeStage: Hellowork.OffreDeStage): UnJeune1Solution.Localisation {
		return {
			ville: offreDeStage.city,
			codePostal: offreDeStage.postalcode.toString(),
			pays: this.pays.versFormatISOAlpha2(offreDeStage.country),
			latitude: offreDeStage.geoloc ? Number(offreDeStage.geoloc.split(",")[0]) : undefined,
			longitude: offreDeStage.geoloc ? Number(offreDeStage.geoloc.split(",")[1]) : undefined,
		};
	}

	private mapToRemuneration(salaryDetails: Hellowork.SalaryDetails): SalaireDetail {
		const periodesSalaire = Object.values(UnJeune1Solution.PeriodeSalaire);
		const salaryMax = salaryDetails?.salary_max?.amount;
		const salaryMin = salaryDetails?.salary_min?.amount;

		if (periodesSalaire.includes(salaryDetails.periode as UnJeune1Solution.PeriodeSalaire) && salaryMax && salaryMin) {
			const salaryMaxWithPoint = salaryMax.replace(",", ".");
			const salaryMinWithPoint = salaryMin.replace(",", ".");

			return {
				periodeSalaire: salaryDetails.periode as UnJeune1Solution.PeriodeSalaire,
				salaireMax: Number(salaryMaxWithPoint),
				salaireMin: Number(salaryMinWithPoint),
			};
		}

		return { periodeSalaire: undefined, salaireMax: undefined, salaireMin: undefined };
	}
}
