import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import {
	EnvoyerLesContactsCejAPoleEmploi,
} from "@gestion-des-contacts/src/application-service/envoyer-les-contacts-cej-a-pole-emploi.usecase";
import { ContactCejRepository } from "@gestion-des-contacts/src/domain/service/contact-cej.repository";
import { ContactCejFixtureBuilder } from "@gestion-des-contacts/test/fixture/contact-cej.fixture-builder";

const contactsCej = [
	ContactCejFixtureBuilder.build(),
	ContactCejFixtureBuilder.build({
		prenom: "Julie",
		nom: "Durand",
		email: "julie.durand@example.com",
		telephone: "0601020304",
		age: 16,
		ville: "Le Mans",
		codePostal: "72000",
	}),
];
let contactCejRepository: StubbedType<ContactCejRepository>;
let usecase: EnvoyerLesContactsCejAPoleEmploi;

describe("EnvoyerLesContactsCejAPoleEmploiUsecaseTest", () => {
	beforeEach(() => {
		// Given
		contactCejRepository = stubInterface<ContactCejRepository>(sinon);
		usecase = new EnvoyerLesContactsCejAPoleEmploi(contactCejRepository);
	});

	it("je dépose les contacts contrat d'engagement jeunes dans le répertoire souhaité", async () => {
		// Given
		contactCejRepository.recupererLesContactsCej.resolves(contactsCej);

		// When
		await usecase.executer();

		// Then
		expect(contactCejRepository.envoyerLesContactsCejAPoleEmploi).to.have.been.called;
		expect(contactCejRepository.envoyerLesContactsCejAPoleEmploi).to.have.been.calledWith(contactsCej);
	});

	it("je récupère les contacts de contrat d'engagement jeunes", async () => {
		// Given
		contactCejRepository.recupererLesContactsCej.resolves([]);

		// When
		await usecase.executer();

		// Then
		expect(contactCejRepository.recupererLesContactsCej).to.have.been.called;
	});

	it("je supprime les contacts de contrat d'engagement jeunes", async () => {
		// Given
		contactCejRepository.recupererLesContactsCej.resolves(contactsCej);

		// When
		await usecase.executer();

		// Then
		expect(contactCejRepository.supprimerLesContactsEnvoyesAPoleEmploi).to.have.been.calledWith(contactsCej);
	});
});
