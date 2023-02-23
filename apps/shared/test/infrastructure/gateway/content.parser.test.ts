import { XMLParser } from "fast-xml-parser";

import { expect } from "@test/configuration";

import { XmlContentParser } from "@shared/src/infrastructure/gateway/content.parser";

describe("ContentParserTest", () => {
	context("Lorsque je parse le contenu XML en objet Javascript", () => {
		it("Je récupère un objet Javascript", async () => {
			const xmlParser = new XMLParser({ trimValues: true });
			const xmlContentParserRepository = new XmlContentParser(xmlParser);
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

	context("Lorsque je parse un string XML avec des CDATA", () => {
		it("Je récupère un string", async () => {
			const xmlParser = new XMLParser({ trimValues: true });
			const xmlContentParser = new XmlContentParser(xmlParser);
			const contenu = "<string><![CDATA[wtf with this xml]]></string>";
			const objetJSAttendu = { string: "wtf with this xml" };

			const resultat = await xmlContentParser.parse(contenu);

			expect(resultat).to.eql(objetJSAttendu);
		});
	});
});
