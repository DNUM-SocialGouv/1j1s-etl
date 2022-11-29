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

        depuisTousMobilises(evenements: TousMobilises.Contenu[]): UnJeuneUneSolution.Evenement[] {
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
