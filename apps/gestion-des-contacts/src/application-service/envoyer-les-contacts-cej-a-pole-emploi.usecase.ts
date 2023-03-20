import { ContactCej } from "@gestion-des-contacts/src/domain/model/contact-cej";
import { ContactCejRepository } from "@gestion-des-contacts/src/domain/service/contact-cej.repository";

import { Usecase } from "@shared/src/application-service/usecase";

export class EnvoyerLesContactsCejAPoleEmploi implements Usecase {
	constructor(private readonly contactCejRepository: ContactCejRepository) {
	}

	public async executer(): Promise<void> {
		const contactsCej: Array<ContactCej> = await this.contactCejRepository.recupererLesContactsCej();

		await this.contactCejRepository.envoyerLesContactsCejAPoleEmploi(contactsCej);

		await this.contactCejRepository.supprimerLesContactsEnvoyesAPoleEmploi(contactsCej);
	}
}
