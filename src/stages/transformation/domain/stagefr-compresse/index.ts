import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { UnJeune1Solution } from "@stages/transformation/domain/1jeune1solution";

export namespace StagefrCompresse {
    export type Contenu = {
        jobs: {
            job: Array<OffreDeStage>
        }
    }

    export type OffreDeStage = {
        cpc: string,
        guid: number,
        title: string,
        salary: string,
        description: string,
        url: string,
        employer: string,
        category: string,
        post_date: string,
        contract_type: string,
        contract_time: string,
        location: {
            location: string,
            location_raw: string,
            location_parent: string,
            country: string,
            geo_lng: number,
            geo_lat: number,
        },
        logo: string,
    }

    export class Convertir {
        constructor(private readonly dateService: DateService, private readonly assainisseurDeTexte: AssainisseurDeTexte) {
        }

        public depuisStagefrCompresse(offreDeStage: OffreDeStage): UnJeune1Solution.OffreDeStage {
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
}
