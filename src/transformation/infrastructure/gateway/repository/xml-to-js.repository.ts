import { XMLParser } from "fast-xml-parser";
import fs from "fs";

export class XmlToJsRepository {
	private readonly parser: XMLParser;

	constructor() {
		// TODO : injection de dépendance
		this.parser = new XMLParser({
			trimValues: true
		});
	}

	extractFlux<T>(xmlPath: string): T {
		const xml = fs.readFileSync(xmlPath, "utf8");
		return this.parser.parse(xml) as T;
	}
}
