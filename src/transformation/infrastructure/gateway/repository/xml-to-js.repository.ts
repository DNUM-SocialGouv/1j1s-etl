import { XMLParser } from "fast-xml-parser";
import fs from "fs";

export class XmlToJsRepository {
	private readonly parser: XMLParser;

	constructor() {
		this.parser = new XMLParser({
			trimValues: true
		});
	}

	extractFlux<T>(xmlPath: string): T {
		try {
			const xml = fs.readFileSync(xmlPath, "utf8");
			return this.parser.parse(xml) as T;
		} catch (error) {
			throw error;
		}
	}
}
