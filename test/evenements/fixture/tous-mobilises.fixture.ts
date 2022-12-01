import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import { UnjeuneUneSolutionTransformation } from "@evenements/transformation/domain/1jeune1solution";
import { UnjeuneUneSolutionChargement } from "@evenements/chargement/domain/1jeune1solution";

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

export function aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre(): UnjeuneUneSolutionTransformation.Evenement[] {
    return [
        {
            dateDebut: "2022-11-24T09:00:00",
            description: "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
            idSource: "272709",
            lieuEvenement: "Matha",
            modaliteInscription: "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - SAINT JEAN D ANGELY",
            titreEvenement: "Pôle emploi - Recrutement ADEF+",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
            dateFin: "2022-11-24T12:00:00",
        },
        {
            dateDebut: "2022-11-24T08:30:00",
            description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
            idSource: "272510",
            lieuEvenement: "Clermont",
            modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
            titreEvenement: "Pôle emploi - LACTALIS",
            typeEvenement: "seance_information",
            source: "tous-mobilises",
            dateFin: "2022-11-24T16:15:00",
        },
    ];
}

export function aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges(): UnjeuneUneSolutionChargement.EvenementDejaCharge[] {
    return [
        {
            id: 1,
            dateDebut: "2022-11-24T09:00:00",
            description: "Evénement de Recrutement - Jeunes - Venez rencontrer ADEF+ qui vous accompagne dans votre insertion et vous propose des postes d'employé(e) de ménage à domicile et d'agent de service auprès des collectivités dans le secteur de Matha - Salle complexe associatif - rue des Douves",
            idSource: "272709",
            lieuEvenement: "Matha",
            modaliteInscription: "**Merci de vous inscrire en adressant un mail à votre conseiller(ère) référent(e) via votre espace personnel Pôle-Emploi",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - SAINT JEAN D ANGELY",
            titreEvenement: "Pôle emploi - Recrutement ADEF+",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
            dateFin: "2022-11-24T12:00:00",
        },
        {
            id: 2,
            dateDebut: "2022-11-24T08:30:00",
            description: "Evénement de Découverte métier/secteur - Jeunes - Le 24 novembre se déroulera une découverte des métiers de l'industrie alimentaire dans le cadre d'une visite de la société Lactalis de Clermont. Merci de contacter votre conseiller Pôle emploi afin de vous positionner. ",
            idSource: "272510",
            lieuEvenement: "Clermont",
            modaliteInscription: "Merci de contacter votre conseiller Pôle emploi afin de vous positionner.",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - CLERMONT FITZ JAMES",
            titreEvenement: "Pôle emploi - LACTALIS",
            typeEvenement: "seance_information",
            source: "tous-mobilises",
            dateFin: "2022-11-24T16:15:00",
        },
    ];
}
export function aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25(): UnjeuneUneSolutionChargement.Evenement[] {
    return [
        ...aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre(),
        {
            dateDebut: "2022-11-25T09:30:00",
            dateFin: "2022-11-25T12:00:00",
            description: "Evénement de Recrutement - Jeunes - Café de l'Emploi IAE\n" +
                "de 9h30 à 12h à France Services Audierne",
            idSource: "272739",
            lieuEvenement: "Audierne",
            modaliteInscription: "Inscription auprès de France Services Audierne au 02.98.70.08.78.",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - DOUARNENEZ",
            titreEvenement: "Pôle emploi - Café de l'Emploi IAE",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
        {
            dateDebut: "2022-11-25T10:00:00",
            dateFin: "2022-11-25T12:29:00",
            description: "Evénement de Recrutement - Jeunes - Job dating poste de Vendeur / Vendeuse en prêt-à-porter. Poste en CDI 24H/SEM. Vous travaillez les jeudis, vendredis et samedis.",
            idSource: "274144",
            lieuEvenement: "Lesneven",
            modaliteInscription: "Ce recrutement vous intéresse ! Pour y participer merci d'adresser un mail à recrutement.29061@pole-emploi.fr en précisant vos coordonnées et à l'attention de Mme Fourn",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - LANDERNEAU",
            titreEvenement: "Pôle emploi - Recrutement ",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
    ];
}


export function aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt2Le25DejaCharges(): UnjeuneUneSolutionChargement.EvenementDejaCharge[] {
    return [
        ...aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreDejaCharges(),
        {
            id: 3,
            dateDebut: "2022-11-25T09:30:00",
            dateFin: "2022-11-25T12:00:00",
            description: "Evénement de Recrutement - Jeunes - Café de l'Emploi IAE\n" +
                "de 9h30 à 12h à France Services Audierne",
            idSource: "272739",
            lieuEvenement: "Audierne",
            modaliteInscription: "Inscription auprès de France Services Audierne au 02.98.70.08.78.",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - DOUARNENEZ",
            titreEvenement: "Pôle emploi - Café de l'Emploi IAE",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
        {
            id: 4,
            dateDebut: "2022-11-25T10:00:00",
            dateFin: "2022-11-25T12:29:00",
            description: "Evénement de Recrutement - Jeunes - Job dating poste de Vendeur / Vendeuse en prêt-à-porter. Poste en CDI 24H/SEM. Vous travaillez les jeudis, vendredis et samedis.",
            idSource: "274144",
            lieuEvenement: "Lesneven",
            modaliteInscription: "Ce recrutement vous intéresse ! Pour y participer merci d'adresser un mail à recrutement.29061@pole-emploi.fr en précisant vos coordonnées et à l'attention de Mme Fourn",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - LANDERNEAU",
            titreEvenement: "Pôle emploi - Recrutement ",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
    ];
}

export function aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24NovembreEt1EvenementLe25Et1EvenementLe26(): UnjeuneUneSolutionTransformation.Evenement[] {
    return [
        ...aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe24Novembre(),
        {
            dateDebut: "2022-11-26T09:30:00",
            dateFin: "2022-11-26T12:00:00",
            description: "Evénement de Recrutement - Jeunes - Café de l'Emploi IAE\n" +
                "de 9h30 à 12h à France Services Audierne",
            idSource: "272739",
            lieuEvenement: "Audierne",
            modaliteInscription: "Inscription auprès de France Services Audierne au 02.98.70.08.78.",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - DOUARNENEZ",
            titreEvenement: "Pôle emploi - Café de l'Emploi IAE",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
        {
            dateDebut: "2022-11-25T10:00:00",
            dateFin: "2022-11-25T12:29:00",
            description: "Evénement de Recrutement - Jeunes - Job dating poste de Vendeur / Vendeuse en prêt-à-porter. Poste en CDI 24H/SEM. Vous travaillez les jeudis, vendredis et samedis.",
            idSource: "274144",
            lieuEvenement: "Lesneven",
            modaliteInscription: "Ce recrutement vous intéresse ! Pour y participer merci d'adresser un mail à recrutement.29061@pole-emploi.fr en précisant vos coordonnées et à l'attention de Mme Fourn",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - LANDERNEAU",
            titreEvenement: "Pôle emploi - Recrutement ",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
    ];
}

export function aUnJeuneUneSolutionTousMobilisesAvec2EvenementsLe25Novembre(): UnjeuneUneSolutionTransformation.Evenement[] {
    return [
        {
            dateDebut: "2022-11-25T09:30:00",
            dateFin: "2022-11-25T12:00:00",
            description: "Evénement de Recrutement - Jeunes - Café de l'Emploi IAE\n" +
                "de 9h30 à 12h à France Services Audierne",
            idSource: "272739",
            lieuEvenement: "Audierne",
            modaliteInscription: "Inscription auprès de France Services Audierne au 02.98.70.08.78.",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - DOUARNENEZ",
            titreEvenement: "Pôle emploi - Café de l'Emploi IAE",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
        {
            dateDebut: "2022-11-25T10:00:00",
            dateFin: "2022-11-25T12:29:00",
            description: "Evénement de Recrutement - Jeunes - Job dating poste de Vendeur / Vendeuse en prêt-à-porter. Poste en CDI 24H/SEM. Vous travaillez les jeudis, vendredis et samedis.",
            idSource: "274144",
            lieuEvenement: "Lesneven",
            modaliteInscription: "Ce recrutement vous intéresse ! Pour y participer merci d'adresser un mail à recrutement.29061@pole-emploi.fr en précisant vos coordonnées et à l'attention de Mme Fourn",
            online: false,
            organismeOrganisateur: "Agence pôle emploi - LANDERNEAU",
            titreEvenement: "Pôle emploi - Recrutement ",
            typeEvenement: "job_dating",
            source: "tous-mobilises",
        },
    ];
}
