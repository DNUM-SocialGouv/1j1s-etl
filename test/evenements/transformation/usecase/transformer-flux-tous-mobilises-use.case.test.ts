import sinon from "sinon";

import {
    evenement1Le24Novembre,
    evenement2Le24Novembre,
} from "@test/evenements/fixture/evenements-un-jeune-une-solution.fixture";
import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { DateService } from "@shared/date.service";
import { EvenementsRepository } from "@evenements/transformation/domain/evenements.repository";
import { expect } from "@test/configuration";
import { FluxTransformation } from "@stages/transformation/domain/flux";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import {
    TransformerFluxTousMobilisesUseCase,
} from "@evenements/transformation/usecase/transformer-flux-tous-mobilises-use.case";
import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import VersTousMobilises = TousMobilises.Convertir;

describe("TransformerFluxTousMobilisesUseCase", () => {
    let useCase: TransformerFluxTousMobilisesUseCase;
    let repo: StubbedType<EvenementsRepository>;
    let sanitized: StubbedType<AssainisseurDeTexte>;
    let flux: FluxTransformation;

    const aTousMobilisesFlux = [
        {
            "date": "24/11/2022",
            "description": "description",
            "horaireDebutEvenement": "09:00",
            "horaireFinEvenement": "12:00",
            "id": "272709",
            "lieuEvenement": "lieuEvenement",
            "modaliteInscription": "modaliteInscription",
            "online": "false",
            "organismeOrganisateur": "organismeOrganisateur",
            "titreEvenement": "titreEvenement",
            "typeEvenement": "typeEvenement",
        },
        {
            "date": "24/11/2022",
            "description": "description",
            "horaireDebutEvenement": "08:30",
            "horaireFinEvenement": "16:15",
            "id": "272510",
            "lieuEvenement": "lieuEvenement",
            "modaliteInscription": "modaliteInscription",
            "online": "false",
            "organismeOrganisateur": "organismeOrganisateur",
            "titreEvenement": "titreEvenement",
            "typeEvenement": "typeEvenement",
        },
    ];

    const aCorruptedFluxTousMobilises = [
        ...aTousMobilisesFlux,
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

    beforeEach(() => {
        repo = stubInterface<EvenementsRepository>(sinon);
        sanitized = stubInterface<AssainisseurDeTexte>(sinon);
        sanitized.nettoyer.withArgs("modaliteInscription").returns("modaliteInscription");

        flux = new FluxTransformation("tous-mobilises", "history", ".json", ".json");

        useCase = new TransformerFluxTousMobilisesUseCase(repo, new VersTousMobilises(new DateService(), sanitized));
    });

    context("quand je récupère un flux provenent du flux tous mobilises", () => {

        beforeEach(() => {
            repo.recuperer.resolves(aTousMobilisesFlux);
        });

        it("je retourne une liste d'évenement d'un jeune une solution", async () => {
            await useCase.executer<TousMobilises.Contenu>(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.have.been.calledWith([evenement1Le24Novembre, evenement2Le24Novembre], flux);
        });
    });

    context("lorsque je récupère un item qui n'a pas de date dans le flux", () => {
        beforeEach(() => {
            repo.recuperer.resolves(aCorruptedFluxTousMobilises);
        });

        it("je l'ignore et je retourne une liste d'évenement d'un jeune une solution", async () => {
            await useCase.executer<TousMobilises.Contenu>(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.have.been.calledWith([evenement1Le24Novembre, evenement2Le24Novembre], flux);
        });
    });
});
