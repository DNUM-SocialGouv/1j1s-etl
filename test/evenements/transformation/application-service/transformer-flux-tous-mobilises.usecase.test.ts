import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { Convertir } from "@evenements/transformation/domain/service/tous-mobilises/convertir.domain-service";
import { DateService } from "@shared/date.service";
import {
    evenement1Le24Novembre,
    evenement2Le24Novembre,
} from "@test/evenements/fixture/evenements-un-jeune-une-solution.fixture";
import { EvenementsRepository } from "@evenements/transformation/domain/service/evenements.repository";
import { expect, sinon, StubbedType, stubInterface } from "@test/configuration";
import { FluxTransformation } from "@evenements/transformation/domain/model/flux";
import { TousMobilises } from "@evenements/transformation/domain/model/tous-mobilises";
import {
    TransformerFluxTousMobilises,
} from "@evenements/transformation/application-service/transformer-flux-tous-mobilises.usecase";

describe("TransformerFluxTousMobilisesUseCase", () => {
    let usecase: TransformerFluxTousMobilises;
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

        usecase = new TransformerFluxTousMobilises(repo, new Convertir(new DateService(), sanitized));
    });

    context("Lorsque je récupère un flux provenent du flux tous mobilises", () => {

        beforeEach(() => {
            repo.recuperer.resolves(aTousMobilisesFlux);
        });

        it("je retourne une liste d'évenement d'un jeune une solution", async () => {
            await usecase.executer(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.have.been.calledWith([evenement1Le24Novembre, evenement2Le24Novembre], flux);
        });
    });

    context("Lorsque je récupère un item qui n'a pas de date dans le flux", () => {
        beforeEach(() => {
            repo.recuperer.resolves(aCorruptedFluxTousMobilises);
        });

        it("je l'ignore et je retourne une liste d'évenement d'un jeune une solution", async () => {
            await usecase.executer(new FluxTransformation("tous-mobilises", "history", ".json", ".json"));

            expect(repo.sauvegarder).to.have.been.calledWith([evenement1Le24Novembre, evenement2Le24Novembre], flux);
        });
    });
});
