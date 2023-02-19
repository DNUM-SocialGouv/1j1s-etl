import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { DateService } from "@shared/src/date.service";
import { StagefrDecompresse } from "@stages/src/transformation/domain/model/stagefr-decompresse";
import { UnJeune1Solution } from "@stages/src/transformation/domain/model/1jeune1solution";

export class Convertir {
	constructor(private readonly dateService: DateService, private readonly assainisseurDeTexte: AssainisseurDeTexte) {
	}

	public depuisStagefrDecompresse(offreDeStage: StagefrDecompresse.OffreDeStage): UnJeune1Solution.OffreDeStage {
		return {
			identifiantSource: offreDeStage.jobid,
			titre: this.assainisseurDeTexte.nettoyer(offreDeStage.title),
			description: this.assainisseurDeTexte.nettoyer(offreDeStage.description),
			dateDeDebut: this.dateService.maintenant().toISOString(),
			employeur: {
				nom: this.assainisseurDeTexte.nettoyer(offreDeStage.company),
				logoUrl: offreDeStage.logo,
			},
			localisation: {
				ville: offreDeStage.city,
				region: offreDeStage.state,
				pays: offreDeStage.country?.toUpperCase(),
			},
			domaines: [{ nom: UnJeune1Solution.Domaine.NON_APPLICABLE }],
			urlDeCandidature: offreDeStage.url,
			sourceCreatedAt: offreDeStage.date,
			sourcePublishedAt: offreDeStage.date,
			sourceUpdatedAt: offreDeStage.date,
			source: UnJeune1Solution.Source.STAGEFR_DECOMPRESSE,
		};
	}
}