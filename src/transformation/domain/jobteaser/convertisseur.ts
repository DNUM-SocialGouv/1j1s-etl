import { DateService } from "@shared/date.service";
import { Jobteaser } from "@transformation/domain/jobteaser/index";
import { OffreDeStage, Source } from "@transformation/domain/1jeune1solution/offre-de-stage";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export class ConvertirOffreDeStage {
	constructor(private readonly dateService: DateService) {
	}

	depuisJobteaser(offreDeStageJobteaser: Jobteaser.OffreDeStage): OffreDeStage {
		return {
			titre: offreDeStageJobteaser.title,
			description: offreDeStageJobteaser.mission,
			employeur: {
				description: offreDeStageJobteaser.company.description,
				nom: offreDeStageJobteaser.company.name,
				logoUrl: offreDeStageJobteaser.company.logo,
				siteUrl: offreDeStageJobteaser.company.website,
			},
			localisation: {
				ville: offreDeStageJobteaser.location.city,
				codePostal: offreDeStageJobteaser.location.zipcode,
				departement: offreDeStageJobteaser.location.department,
				region: offreDeStageJobteaser.location.state,
				pays: offreDeStageJobteaser.location.country,
			},
			source: Source.JOBTEASER,
			urlDeCandidature: offreDeStageJobteaser.external_url,
			teletravailPossible: false,
			dateDeDebut: offreDeStageJobteaser.start_date,
			sourceCreatedAt: offreDeStageJobteaser.date_created,
			sourcePublishedAt: this.dateService.maintenant().toISOString(),
			sourceUpdatedAt: this.dateService.maintenant().toISOString(),
			remunerationBase: -1,
			identifiantSource: offreDeStageJobteaser.reference,
			duree: offreDeStageJobteaser.contract.duration.amount,
			dureeEnJour: Number(offreDeStageJobteaser.contract.duration.amount),
			dureeEnJourMax: undefined,
			domaines: Array.isArray(offreDeStageJobteaser.domains.domain)
				? offreDeStageJobteaser.domains.domain.map((d) => {
					return UnJeune1Solution.Domaine[d as keyof typeof UnJeune1Solution.Domaine] || UnJeune1Solution.Domaine.NON_APPLICABLE;
				})
				: [UnJeune1Solution.Domaine[offreDeStageJobteaser.domains.domain as keyof typeof UnJeune1Solution.Domaine] || UnJeune1Solution.Domaine.NON_APPLICABLE],
		};
	}
}
