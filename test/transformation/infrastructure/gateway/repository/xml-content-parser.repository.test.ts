import { expect } from "@test/configuration";
import {
	XmlContentParserRepository,
} from "@transformation/infrastructure/gateway/repository/xml-content-parser.repository";
import { XMLParser } from "fast-xml-parser";

describe("XmlContentParserRepository", () => {
	context("Lorsque je parse le contenu XML en objet Javascript", () => {
		it("Je récupère un objet Javascript", async () => {
			const xmlParser = new XMLParser({ trimValues: true });
			const xmlContentParserRepository = new XmlContentParserRepository(xmlParser);
			const contenu = `<root>
				<toto>Contenu</toto>
				<titi>Autre contenu</titi>
			</root>`;
			const objetJSAttendu = {
				root: {
					toto: "Contenu",
					titi: "Autre contenu",
				},
			};

			const resultat = await xmlContentParserRepository.parse(contenu);

			expect(resultat).to.eql(objetJSAttendu);
		});
	});
});
