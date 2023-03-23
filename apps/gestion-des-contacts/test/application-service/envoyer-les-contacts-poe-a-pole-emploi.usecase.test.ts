import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import {
    EnvoyerLesContactsPoeAPoleEmploi,
} from "@gestion-des-contacts/src/application-service/envoyer-les-contacts-poe-a-pole-emploi.usecase";
import { ContactPoeRepository } from "@gestion-des-contacts/src/domain/service/contact-poe.repository";

const contactsPoe = [
    { id : "0" },
    { id : "1" },
];

let contactPoeRepository: StubbedType<ContactPoeRepository>;
let usecase: EnvoyerLesContactsPoeAPoleEmploi;

describe("EnvoyerLesContactsCejAPoleEmploiTest", () => {

    beforeEach(() => {
        // Given
        contactPoeRepository = stubInterface<ContactPoeRepository>(sinon);
        usecase = new EnvoyerLesContactsPoeAPoleEmploi(contactPoeRepository);
    });

    it("je dépose les contacts contrat d'engagement jeunes dans le répertoire souhaité", async () => {
        // Given
        contactPoeRepository.recupererLesContactsPoe.resolves(contactsPoe);

        // When
        await usecase.executer();

        // Then
        expect(contactPoeRepository.envoyerLesContactsPoeAPoleEmploi).to.have.been.called;
        expect(contactPoeRepository.envoyerLesContactsPoeAPoleEmploi).to.have.been.calledWith(contactsPoe);
    });

    it("je récupère les contacts de POE", async () => {
        // Given
        contactPoeRepository.recupererLesContactsPoe.resolves([]);

        // When
        await usecase.executer();

        // Then
        expect(contactPoeRepository.recupererLesContactsPoe).to.have.been.called;
    });

    it("je supprime les contacts de POE", async () => {
        // Given
        contactPoeRepository.recupererLesContactsPoe.resolves(contactsPoe);

        // When
        await usecase.executer();

        // Then
        expect(contactPoeRepository.supprimerLesContactsEnvoyesAPoleEmploi).to.have.been.calledWith(contactsPoe);
    });
});
