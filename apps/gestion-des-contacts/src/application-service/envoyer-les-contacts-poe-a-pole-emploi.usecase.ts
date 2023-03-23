import { ContactPoeRepository } from "@gestion-des-contacts/src/domain/service/contact-poe.repository";

import { Usecase } from "@shared/src/application-service/usecase";

export class EnvoyerLesContactsPoeAPoleEmploi implements Usecase {

    constructor(private readonly repository: ContactPoeRepository) {
    }

    public async executer(): Promise<void> {
        const contactsPoe = await this.repository.recupererLesContactsPoe();

        await this.repository.envoyerLesContactsPoeAPoleEmploi(contactsPoe);

        await this.repository.supprimerLesContactsEnvoyesAPoleEmploi(contactsPoe);
    }

}
