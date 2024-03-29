import { XMLParser } from "fast-xml-parser";

import { expect } from "@test/library";

import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";
import { Immojeune } from "@logements/src/transformation/domain/model/immojeune";
import { Studapart } from "@logements/src/transformation/domain/model/studapart";
import {
	AnnonceDeLogementContentParserStrategy,
	StudapartOptionXmlParser,
} from "@logements/src/transformation/infrastructure/gateway/repository/annonce-de-logement-content-parser.strategy";

import {
	ContentParserStrategyError,
	JsonContentParser,
	XmlContentParser,
} from "@shared/src/infrastructure/gateway/content.parser";

describe("AnnonceDeLogementContentParserStrategyTest", () => {
	let contentParserStrategy: AnnonceDeLogementContentParserStrategy;

	beforeEach(() => {
		contentParserStrategy = new AnnonceDeLogementContentParserStrategy(
			new XmlContentParser(new XMLParser({
				trimValues: true,
				isArray: StudapartOptionXmlParser.consideTagAsArray,
			})),
			new JsonContentParser(),
		);
	});

	context("Lorsque je suis sur le flux immojeune", () => {
		it("je retourne un flux", () => {
			const flux = new FluxTransformation("immojeune", "history", ".json", ".json");
			const entree = Buffer.from(`
                [
                    { 
                        "externalId": 1, 
                        "deposit": 1000,
                        "pictures": ["https://image1.jpg", "https://image2.jpg"]
                    },
                    { 
                        "externalId": 2, 
                        "deposit": 2000,
                        "pictures": ["https://image3.jpg"]
                    }
                ]
            `);
			const sortie = [{
				externalId: 1,
				deposit: 1000,
				pictures: ["https://image1.jpg", "https://image2.jpg"],
			}, { externalId: 2, deposit: 2000, pictures: ["https://image3.jpg"] }];

			const result = contentParserStrategy.get<Array<Immojeune.AnnonceDeLogement>>(flux, entree);

			expect(result).to.deep.equal(sortie);
		});
	});

	context("Lorsque je suis sur le flux studapart", () => {
		describe("et que j'ai des listes avec un seul élément", () => {
			it("je retourne une flux avec des listes à un item en précisant des options à mon parser", () => {
				const flux = new FluxTransformation("studapart", "history", ".xml", ".json");
				const entree = Buffer.from(`
                <?xml version="1.0" encoding="utf-8"?>
                <unjeuneunesolution>
                    <item key="0">
                        <id>1</id>
                        <rooms>
                            <deposit>1000</deposit>
                        </rooms>
                        <rooms>
                            <deposit>1255</deposit>
                        </rooms>
                        <pictures>https://image1.jpg</pictures>
                        <pictures>https://image2.jpg</pictures>
                    </item>
                    <item key="1">
                        <id>2</id>
                        <rooms>
                            <deposit>2000</deposit>
                        </rooms>
                        <pictures>https://image3.jpg</pictures>
                    </item>
                </unjeuneunesolution>
                `);
				const sortie = {
					"?xml": "",
					unjeuneunesolution: {
						item: [{
							id: 1,
							rooms: [{ deposit: 1000 }, { deposit: 1255 }],
							pictures: ["https://image1.jpg", "https://image2.jpg"],
						}, { id: 2, rooms: [{ deposit: 2000 }], pictures: ["https://image3.jpg"] }],
					},
				};

				const result = contentParserStrategy.get<Studapart.Contenu>(flux, entree);

				expect(result).to.deep.equal(sortie);
			});
		});
	});

	context("Lorsque je ne suis sur aucun flux connu", () => {
		it("lance une erreur de parsing", () => {
			// Given
			const flux = new FluxTransformation("invalid-flow-name", "history", ".xml", ".json");

			// When Then
			expect(() => contentParserStrategy.get<Studapart.Contenu>(flux, "contenu")).to.throw(
				ContentParserStrategyError,
				`No content parser available for flow ${flux.nom}`
			);
		});
	});
});
