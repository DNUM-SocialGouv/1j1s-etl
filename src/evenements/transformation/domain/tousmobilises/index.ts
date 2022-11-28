import { UnjeuneUneSolution } from "@evenements/transformation/domain/1jeune1solution";
import { DateService } from "@shared/date.service";
import { AssainisseurDeTexte } from "@stages/transformation/domain/assainisseur-de-texte";

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

        depuisTousMobilises(evenements: TousMobilises.Contenu[]): UnjeuneUneSolution.Evenement[] {
            return evenements.filter(evenement => evenement.date && evenement.description).map((evenement: TousMobilises.Contenu) => {
                return {
                    dateDebut: this.dateService.toIsoDate(evenement.date, evenement.horaireDebutEvenement),
                    dateFin: this.dateService.toIsoDate(evenement.date, evenement.horaireFinEvenement),
                    description: evenement.description,
                    idSource: evenement.id,
                    lieuEvenement: evenement.lieuEvenement,
                    modaliteInscription: this.assainisseurDeTexte.nettoyer(evenement.modaliteInscription),
                    online: evenement.online === "true",
                    organismeOrganisateur: evenement.organismeOrganisateur,
                    titreEvenement: evenement.titreEvenement,
                    typeEvenement: evenement.typeEvenement,
                    source: "tous-mobilises",
                };
            });
        }
    }
}