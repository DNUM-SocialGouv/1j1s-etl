import { expect, stubClass } from "@test/configuration";

import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/chargement/domain/1jeune1solution/services/charger-annonces-de-logement.domain-service";
import { ChargerFluxImmojeune } from "@logements/chargement/usecase/charger-flux-immojeune.usecase";
import { FluxChargement } from "@logements/chargement/domain/flux";

describe("ChargerFluxImmojeuneTest", () => {
	context("Lorsque je charge le flux Immojeune", () => {
		it("je charge les annonces de logement issues d'Immojeune", async () => {
			// Given
			const flux = new FluxChargement("immojeune", ".json");
			const chargerAnnoncesDeLogementDomainService = stubClass(ChargerAnnoncesDeLogementDomainService);
			const chargerFluxImmojeune = new ChargerFluxImmojeune(chargerAnnoncesDeLogementDomainService);

			// When
			await chargerFluxImmojeune.executer(flux);

			// Then
			expect(chargerAnnoncesDeLogementDomainService.charger).to.have.been.calledOnceWith(
				new FluxChargement("immojeune", ".json")
			);
		});
	});
});
