import { Devise } from "@shared/devise.value-object";
import { expect } from "@test/configuration";

describe("DeviseTest", () => {
	context("Lorsque la valeur donnée au constructeur est 'EUR'", () => {
		it("transforme la valeur en €", () => {
			// When
			const devise = new Devise("EUR");

			// Then
			const resultat = devise.value;
			expect(resultat).to.equal("€");
		});
	});

	context("Lorsque la valeur donnée au constructeur est 'GBP'", () => {
		it("transforme la valeur en £", () => {
			// When
			const devise = new Devise("GBP");

			// Then
			const resultat = devise.value;
			expect(resultat).to.equal("£");
		});
	});

	context("Lorsque la valeur donnée au constructeur est 'USD'", () => {
		it("transforme la valeur en $", () => {
			// When
			const devise = new Devise("USD");

			// Then
			const resultat = devise.value;
			expect(resultat).to.equal("$");
		});
	});

	context("Lorsque la valeur donnée au constructeur n'est aucune des trois ci-dessus", () => {
		it("transforme la valeur en 'non renseignée'", () => {
			// When
			const devise = new Devise("mauvaise valeur");

			// Then
			const resultat = devise.value;
			expect(resultat).to.equal("non renseignée");
		});
	});
});
