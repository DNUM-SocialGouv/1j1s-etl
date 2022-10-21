import { Flux } from "@extraction/domain/flux";
import { ExtraireFluxDomainService } from "@extraction/domain/services/extraire-flux.domain-service";
import { ExtraireHelloWork } from "@extraction/usecase/extraire-hello-work.usecase";

import { expect, StubbedClass, stubClass } from "@test/configuration";

const flux: Readonly<Flux> = {
	dossierHistorisation: "history",
	extension: ".xml",
	nom: "jobteaser",
	url: "http://some.url",
};
let extraireFluxDomainService: StubbedClass<ExtraireFluxDomainService>;
let extraireHelloWork: ExtraireHelloWork;


describe("ExtraireHelloWorkTest", () => {

    context("Lorsque j'extrais le flux en provenant de Hello work", () => {

        beforeEach( () => {
			extraireFluxDomainService = stubClass(ExtraireFluxDomainService);
			extraireHelloWork = new ExtraireHelloWork(extraireFluxDomainService);
        });

        it("j'extrais le flux", async () => {
            await extraireHelloWork.executer({ ...flux });

			expect(extraireFluxDomainService.extraire).to.have.been.calledOnce;
			expect(extraireFluxDomainService.extraire).to.have.been.calledWith(flux);
        });
    });
});