import { AssainisseurDeTexte } from "@transformation/domain/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { OffreDeStage as _OffreDeStage } from "@transformation/domain/stagefr-decompresse/offre-de-stage";
import { UnJeune1Solution } from "@transformation/domain/1jeune1solution";

export namespace StagefrDecompresse {
    export type OffreDeStage = _OffreDeStage;

    export type Contenu = {
        jobs: {
            job: Array<OffreDeStage>
        }
    }

    export class Convertir {
        constructor(private readonly dateService: DateService, private readonly assainisseurDeTexte: AssainisseurDeTexte) {
        }

        public depuisStagefrDecompresse(offreDeStage: OffreDeStage): UnJeune1Solution.OffreDeStage {
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
}
