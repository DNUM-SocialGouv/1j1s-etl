import { ChargerFluxImmojeune } from "@logements/src/chargement/application-service/charger-flux-immojeune.usecase";
import { FluxChargement } from "@logements/src/chargement/domain/model/flux";
import {
	ChargerAnnoncesDeLogementDomainService,
} from "@logements/src/chargement/domain/service/charger-annonces-de-logement.domain-service";

import { expect, stubClass } from "@shared/test/configuration";

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
