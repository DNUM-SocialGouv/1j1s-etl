import { StubbedType } from "@salesforce/ts-sinon";

import { beforeEach } from "mocha";

import { expect, sinon, stubClass, stubInterface } from "@test/library";

import { FluxExtraction } from "@formations-initiales/src/extraction/domain/model/flux";
import { ExtraireFluxDomainService } from "@formations-initiales/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxRepository } from "@formations-initiales/src/extraction/domain/service/flux.repository";

import { DateService } from "@shared/src/domain/service/date.service";

describe("ExtraireFluxTest - Formations Initiales", () => {
    context("Lorsque j'extrais un flux avec la bonne configuration", () => {
        let fluxRepository: StubbedType<FluxRepository>;
        let dateService: StubbedType<DateService>;
        const AUJOURDHUI = "2022-01-01T00:00:00Z";
        
        beforeEach(() => {
           fluxRepository = stubInterface<FluxRepository>(sinon);
            dateService = stubClass(DateService);
            dateService.maintenant.returns(new Date(AUJOURDHUI));
        });
        it("je récupère le flux à extraire", async () => {
            // GIVEN
            const fluxContent = "un flux toto";
            fluxRepository.recuperer.resolves(fluxContent);
            const flux = new FluxExtraction("flux_formations_initiales_onisep", ".xml", "history", "https://flux.formations-initiales.com/download");
            const extractionService = new ExtraireFluxDomainService(fluxRepository, dateService);

            // WHEN
            await extractionService.extraire(flux);

            // THEN
            expect(fluxRepository.recuperer).to.have.been.calledWith(flux);
        });
        it("je stocke le flux récupéré en historisation", async () => {
            // GIVEN
            const contenuDuFluxRecupere = "un flux toto";
            const nomDuFlux = "flux_formations_initiales_onisep";
            const extensionFichier = ".xml";
            const dossierHistorisation = "history";
            const flux = new FluxExtraction(nomDuFlux, extensionFichier, dossierHistorisation, "https://flux.formations-initiales.com/download");

            const date = new Date("2022-01-01T00:00:00Z");
            dateService.maintenant.returns(new Date(date));

            fluxRepository.recuperer.resolves(contenuDuFluxRecupere);

            const extractionService = new ExtraireFluxDomainService(fluxRepository, dateService);

            // WHEN
            await extractionService.extraire(flux);

            // THEN
            const cheminFichierHistorise = "flux_formations_initiales_onisep/history/2022-01-01T00:00:00.000Z.xml" ;
            expect(fluxRepository.enregistrer).to.have.been.calledWith(cheminFichierHistorise, contenuDuFluxRecupere, flux);
        });

        it("je stocke le flux récupéré dans sa dernière version", async () => {
            // GIVEN
            const contenuDuFluxRecupere = "un flux toto";
            const nomDuFlux = "flux_formations_initiales_onisep";
            const extensionFichier = ".xml";
            const dossierHistorisation = "history";
            const flux = new FluxExtraction(nomDuFlux, extensionFichier, dossierHistorisation, "https://flux.formations-initiales.com/download");

            const date = new Date("2022-01-01T00:00:00Z");
            dateService.maintenant.returns(new Date(date));

            fluxRepository.recuperer.resolves(contenuDuFluxRecupere);

            const extractionService = new ExtraireFluxDomainService(fluxRepository, dateService);

            // WHEN
            await extractionService.extraire(flux);

            // THEN
            const cheminFichierHistorise = "flux_formations_initiales_onisep/latest.xml" ;
            expect(fluxRepository.enregistrer).to.have.been.calledWith(cheminFichierHistorise, contenuDuFluxRecupere, flux);
        });
    });
});
