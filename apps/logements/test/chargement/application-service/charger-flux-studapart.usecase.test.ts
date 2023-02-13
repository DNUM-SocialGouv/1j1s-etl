import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/src/chargement/domain/service/charger-annonces-de-logement.domain-service";
import { ChargerFluxStudapart } from "@logements/src/chargement/application-service/charger-flux-studapart.usecase";
import { ConfigurationFixtureBuilder } from "@logements/test/chargement/fixture/configuration.fixture";
import { expect, stubClass } from "@test/configuration";
import { FluxChargement } from "@logements/src/chargement/domain/model/flux";

describe("ChargementStudapartTest", () => {
    context("Lorsque je souhaite charger les données du flux studapart", () => {
        it("je charge les données du flux", async () => {
			const configuration = ConfigurationFixtureBuilder.build();
			const flux = new FluxChargement(configuration.STUDAPART.NAME, configuration.STUDAPART.EXTENSION);
            const annonceDelogementDomainService = stubClass(ChargerAnnoncesDeLogementDomainService);
            const chargerFluxStudapart = new ChargerFluxStudapart(annonceDelogementDomainService);

			await chargerFluxStudapart.executer(flux);

			expect(annonceDelogementDomainService.charger).to.have.been.calledOnceWith(flux);
		});
	});
});
