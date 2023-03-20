import { ContactCej } from "@gestion-des-contacts/src/domain/model/contact-cej";

export interface ContactCejRepository {
	envoyerLesContactsCejAPoleEmploi(contactsCej: Array<ContactCej>): Promise<void>;
	recupererLesContactsCej(): Promise<Array<ContactCej>>;
	supprimerLesContactsEnvoyesAPoleEmploi(contactsCej: Array<ContactCej>): Promise<void>;
}
