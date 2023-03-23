import { ContactPoe } from "@gestion-des-contacts/src/domain/model/contact-poe";

export interface ContactPoeRepository {
    envoyerLesContactsPoeAPoleEmploi(contactsCej: Array<ContactPoe>): Promise<void>;
    recupererLesContactsPoe(): Promise<Array<ContactPoe>>;
    supprimerLesContactsEnvoyesAPoleEmploi(contactsCej: Array<ContactPoe>): Promise<void>;
}
