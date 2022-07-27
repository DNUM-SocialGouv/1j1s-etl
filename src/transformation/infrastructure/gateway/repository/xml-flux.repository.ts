import fs from "fs";
import { XMLParser } from "fast-xml-parser";

import { FluxRepository } from "@transformation/domain/flux.repository";

export class XmlFluxRepository implements FluxRepository {
	private readonly parser: XMLParser;

	constructor() {
		// TODO : injection de dépendance
		this.parser = new XMLParser({
			trimValues: true,
		});
	}

	recuperer<T>(xmlPath: string): T {
		const xml = fs.readFileSync(xmlPath, "utf8");
		return this.parser.parse(xml) as T;
	}
}
