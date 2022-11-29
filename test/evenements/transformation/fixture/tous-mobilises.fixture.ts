import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";

export function aTousMobilisesFlux(): TousMobilises.Contenu[] {
    return [
        {
            "date": "24/11/2022",
            "description": "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
            "horaireDebutEvenement": "09:00",
            "horaireFinEvenement": "12:00",
            "id": "272709",
            "lieuEvenement": "Matha",
            "modaliteInscription": "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
            "online": "false",
            "organismeOrganisateur": "Agence pôle emploi - SAINT JEAN D ANGELY",
            "titreEvenement": "Pôle emploi - Recrutement ADEF+",
            "typeEvenement": "job_dating",
        },
        {
            "date": "24/11/2022",
            "description": "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
            "horaireDebutEvenement": "08:30",
            "horaireFinEvenement": "16:15",
            "id": "272510",
            "lieuEvenement": "Clermont",
            "modaliteInscription": "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
            "online": "false",
            "organismeOrganisateur": "Agence pôle emploi - CLERMONT FITZ JAMES",
            "titreEvenement": "Pôle emploi - LACTALIS",
            "typeEvenement": "seance_information",
        },
    ];
}

export function aCorruptedFluxTousMobilises(): TousMobilises.Contenu[] {
    return [
        ...aTousMobilisesFlux(),
        {
            "horaireDebutEvenement": "09:00",
            "horaireFinEvenement": "11:00",
            "id": "MEE-36173",
            "lieuEvenement": "Montval-sur-Loir",
            "modaliteInscription": "<a href=\"https://mesevenementsemploi.pole-emploi.fr/mes-evenements-emploi/evenement/36173\" target=\"_blank\">Pour vous inscrire, inscrivez-vous sur Mes ï¿½vï¿½nements emploi</a>",
            "online": "false",
            "organismeOrganisateur": "Agence pôle emploi - null",
            "titreEvenement": "Pôle emploi - null",
            "typeEvenement": "Réunion d'information",
        } as unknown as TousMobilises.Contenu,
    ];
}
