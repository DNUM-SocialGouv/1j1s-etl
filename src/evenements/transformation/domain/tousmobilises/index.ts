import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { UnJeuneUneSolution } from "@evenements/transformation/domain/1jeune1solution";

export namespace TousMobilises {
    export type Contenu = {
        date: string
        description: string
        horaireDebutEvenement: string
        horaireFinEvenement: string
        id: string
        lieuEvenement: string
        modaliteInscription: string
        online: string
        organismeOrganisateur: string
        titreEvenement: string
        typeEvenement: string
    }

    export class Convertir {
        constructor(
            private readonly dateService: DateService,
            private readonly assainisseurDeTexte: AssainisseurDeTexte,
        ) {}

        depuisTousMobilises(evenements: Array<TousMobilises.Contenu>): Array<UnJeuneUneSolution.Evenement> {
            return evenements.filter(evenement => evenement.date && evenement.description).map((evenement: TousMobilises.Contenu) => {
                return {
                    dateDebut: this.dateService.toIsoDateAvecDateEtHoraire(evenement.date, evenement.horaireDebutEvenement),
                    dateFin: this.dateService.toIsoDateAvecDateEtHoraire(evenement.date, evenement.horaireFinEvenement),
                    description: evenement.description,
                    idSource: evenement.id,
                    lieuEvenement: evenement.lieuEvenement,
                    modaliteInscription: this.assainisseurDeTexte.nettoyer(evenement.modaliteInscription),
                    online: evenement.online === "true",
                    organismeOrganisateur: evenement.organismeOrganisateur,
                    titreEvenement: evenement.titreEvenement,
                    typeEvenement: this.desinfecteTypeEvenement(evenement.typeEvenement),
                    source: "tous-mobilises",
                };
            });
        }

        private desinfecteTypeEvenement(typeEvenement: string): string {
            switch (typeEvenement) {
                case "Job dating": return "job_dating";
                case "Atelier": return "atelier";
                case "Réunion d'information": return "reunion_information";
                case "Conférence": return "conference";
                case "Salon en ligne": return "salon_en_ligne";
                case "Forum": return "forum";
                default: return typeEvenement;
            }
        }
    }
}
