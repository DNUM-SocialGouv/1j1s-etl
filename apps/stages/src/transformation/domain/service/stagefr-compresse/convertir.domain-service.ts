import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";

import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";
import { StagefrCompresse } from "@stages/src/transformation/domain/model/stagefr-compresse";

export class Convertir {
	constructor(private readonly dateService: DateService, private readonly assainisseurDeTexte: AssainisseurDeTexte) {
	}

	public depuisStagefrCompresse(offreDeStage: StagefrCompresse.OffreDeStage): UnJeune1Solution.OffreDeStage {
		return {
			identifiantSource: offreDeStage.guid.toString(),
			titre: this.assainisseurDeTexte.nettoyer(offreDeStage.title),
			description: this.assainisseurDeTexte.nettoyer(offreDeStage.description),
			dateDeDebut: this.dateService.maintenant().toISOString(),
			employeur: {
				nom: this.assainisseurDeTexte.nettoyer(offreDeStage.employer),
				logoUrl: offreDeStage.logo,
			},
			localisation: {
				ville: offreDeStage.location.location,
				codePostal: offreDeStage.location.location_raw,
				pays: offreDeStage.location.country?.toUpperCase(),
				longitude: offreDeStage.location.geo_lng ? offreDeStage.location.geo_lng : 0,
				latitude: offreDeStage.location.geo_lat ? offreDeStage.location.geo_lat : 0,
			},
			domaines: [{ nom: UnJeune1Solution.Domaine.NON_APPLICABLE }],
			remunerationBase: Number(offreDeStage.salary) || undefined,
			urlDeCandidature: offreDeStage.url,
			sourceCreatedAt: offreDeStage.post_date,
			sourcePublishedAt: offreDeStage.post_date,
			sourceUpdatedAt: offreDeStage.post_date,
			source: UnJeune1Solution.Source.STAGEFR_COMPRESSE,
			dureeEnJour: Number(offreDeStage.contract_time) || undefined,
		};
	}
}
