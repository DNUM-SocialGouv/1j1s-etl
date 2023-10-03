import { expect, StubbedClass, stubClass } from "@test/library";

import { ChargerFluxHellowork } from "@stages/src/chargement/application-service/charger-flux-hellowork.usecase";
import { FluxChargement } from "@stages/src/chargement/domain/model/flux";
import {
  ChargerOffresDeStageDomainService,
} from "@stages/src/chargement/domain/service/charger-offres-de-stage.domain-service";

let extension: string;
let nomDuFlux: string;
let flux: FluxChargement;

let domainService: StubbedClass<ChargerOffresDeStageDomainService>;
let usecase: ChargerFluxHellowork;

describe("ChargerFluxHelloworkTest", () => {
  context("Lorsque je charge le flux Hellowork", () => {
    beforeEach(() => {
      nomDuFlux = "hellowork";
      extension = ".json";

      flux = new FluxChargement(nomDuFlux, extension);

      domainService = stubClass(ChargerOffresDeStageDomainService);
      usecase = new ChargerFluxHellowork(domainService);
    });

    it("Je charge ce dernier", async () => {
      await usecase.executer(flux);

      expect(domainService.charger).to.have.been.calledOnce;
      expect(domainService.charger).to.have.been.calledWith(flux);
    });
  });
});
