import { ContactPoe } from "@gestion-des-contacts/src/domain/model/contact-poe";
import {
	StrapiContactPoe,
} from "@gestion-des-contacts/src/infrastructure/gateway/repository/http-minio-contact-poe.repository";

export class ContactPoeFixtureBuilder {
	public static build(overrides?: Partial<ContactPoe>): ContactPoe {
		const defaults: ContactPoe = {
			id: "1",
			nom: "Favre",
			prenom: "Patrice",
			email: "patrice.favre@example.com",
			telephone: "0602547698",
			codePostal: "75008",
			ville: "Paris",
			dateDeCreation: "2023-01-01T01:00:00.000Z",
			siret: "12345678",
			nomSociete: "OCTO Technology",
			taille: "400000",
			secteur: "Agricole",
			travail: "RH",
			erreur: "Quelque chose c'est mal passé",
			nombreARecruter: "420",
			commentaire: "Vive le travail du monde agricole",
		};

		return { ...defaults, ...overrides };
	}

	public static buildStrapi(overrides?: Partial<StrapiContactPoe>): StrapiContactPoe {
		const defaults = {
			id: "1",
			nom: "Favre",
			prenom: "Patrice",
			email: "patrice.favre@example.com",
			telephone: "0602547698",
			code_postal: "75008",
			ville: "Paris",
			createdAt: "2023-01-01T01:00:00.000Z",
			siret: "12345678",
			nom_societe: "OCTO Technology",
			taille: "400000",
			secteur: "Agricole",
			travail: "RH",
			erreur: "Quelque chose c'est mal passé",
			nombreARecruter: "420",
			commentaire: "Vive le travail du monde agricole",
		};

		return { ...defaults, ...overrides };
	}
}
