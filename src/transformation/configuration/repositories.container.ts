import { XMLParser } from "fast-xml-parser";

import { RepositoriesContainer } from "../infrastructure/gateway/repository";
import { xmlToJsRepositoryBisFactory } from "../infrastructure/gateway/repository/xml-to-js-repository-bis";

export function createRepositoriesContainer(): RepositoriesContainer {
	const parser = new XMLParser()

	return {
		extractFlux: xmlToJsRepositoryBisFactory(parser)
	};
}
