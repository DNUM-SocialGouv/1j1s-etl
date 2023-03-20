import { ContactCej } from "@gestion-des-contacts/src/domain/model/contact-cej";
import {
	StrapiContactCej,
} from "@gestion-des-contacts/src/infrastructure/gateway/repository/http-minio-contact-cej.repository";

export class ContactCejFixtureBuilder {
	public static build(overrides?: Partial<ContactCej>): ContactCej {
		const defaults: ContactCej = {
			id: "1",
			nom: "Favre",
			prenom: "Patrice",
			email: "patrice.favre@example.com",
			telephone: "0602547698",
			age: 19,
			codePostal: "75008",
			ville: "Paris",
			dateDeCreation: "2023-01-01T01:00:00.000Z",
		};

		return { ...defaults, ...overrides };
	}

	public static buildStrapi(overrides?: Partial<StrapiContactCej>): StrapiContactCej {
		const defaults = {
			id: "1",
			nom: "Favre",
			prenom: "Patrice",
			email: "patrice.favre@example.com",
			telephone: "0602547698",
			age: 19,
			code_postal: "75008",
			ville: "Paris",
			createdAt: "2023-01-01T01:00:00.000Z",
		};

		return { ...defaults, ...overrides };
	}
}
