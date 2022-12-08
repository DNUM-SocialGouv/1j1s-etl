import { UnJeuneUneSolution } from "@evenements/chargement/domain/1jeune1solution";

export class EvenementUnJeuneUneSolutionFixtureBuilder {
    static defaultEvent = {
        dateDebut: "2022-11-24T09:00:00",
        description: "description",
        idSource: "272709",
        lieuEvenement: "lieuEvenement",
        modaliteInscription: "modaliteInscription",
        online: false,
        organismeOrganisateur: "organismeOrganisateur",
        titreEvenement: "titreEvenement",
        typeEvenement: "typeEvenement",
        source: "tous-mobilises",
        dateFin: "2022-11-24T12:00:00",
    };

    public static buildEvenement(
        evenenement?: Partial<UnJeuneUneSolution.Evenement>
    ): UnJeuneUneSolution.Evenement {
        return {
            ...EvenementUnJeuneUneSolutionFixtureBuilder.defaultEvent,
            ...evenenement,
        };
    }

    public static buildEvenementDejaCharge(
        evenenement?: Partial<UnJeuneUneSolution.EvenementDejaCharge>
    ): UnJeuneUneSolution.EvenementDejaCharge {
        return {
            id: 1,
            ...EvenementUnJeuneUneSolutionFixtureBuilder.defaultEvent,
            ...evenenement,
        };
    }

    public static buildEvenementAMettreAJour(
        evenenement?: Partial<UnJeuneUneSolution.EvenementAMettreAJour>
    ): UnJeuneUneSolution.EvenementAMettreAJour {
        return {
            id: 1,
            ...EvenementUnJeuneUneSolutionFixtureBuilder.defaultEvent,
            ...evenenement,
        };
    }

    public static buildEvenementASupprimer(
        evenenement?: Partial<UnJeuneUneSolution.EvenementASupprimer>
    ): UnJeuneUneSolution.EvenementASupprimer {
        return {
            id: 1,
            ...EvenementUnJeuneUneSolutionFixtureBuilder.defaultEvent,
            ...evenenement,
        };
    }
}

export const evenement1Le24Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenement({
    dateDebut: "2022-11-24T09:00:00",
    idSource: "272709",
    dateFin: "2022-11-24T12:00:00",
});

export const evenementDejaCharge1Le24Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementDejaCharge({
    id: 1,
    ...evenement1Le24Novembre,
});

export const evenement2Le24Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenement({
    dateDebut: "2022-11-24T08:30:00",
    idSource: "272510",
    dateFin: "2022-11-24T16:15:00",
});

export const evenementDejaCharge2Le24Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementDejaCharge({
    id: 2,
    ...evenement2Le24Novembre,
});

export const evenement3Le25Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenement({
    dateDebut: "2022-11-25T09:30:00",
    idSource: "272739",
    dateFin: "2022-11-25T12:00:00",
});

export const evenementDejaCharge1Le25Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementDejaCharge({
    id: 3,
    ...evenement3Le25Novembre,
});

export const evenement4Le25Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenement({
    dateDebut: "2022-11-25T10:00:00",
    idSource: "274144",
    dateFin: "2022-11-25T12:29:00",
});

export const evenementDejaCharge2Le25Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenementDejaCharge({
    id: 4,
    ...evenement4Le25Novembre,
});

export const evenementLe26Novembre = EvenementUnJeuneUneSolutionFixtureBuilder.buildEvenement({
    dateDebut: "2022-11-26T09:30:00",
    idSource: "272739",
    dateFin: "2022-11-26T12:00:00",
});
