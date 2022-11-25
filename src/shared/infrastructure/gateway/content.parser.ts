import { XMLParser } from "fast-xml-parser";

export interface ContentParser {
	parse<T>(xmlContent: string | Buffer): Promise<T>;
}

export class XmlContentParser implements ContentParser {
	constructor(private readonly parser: XMLParser,) {
	}

	public parse<T>(xmlContent: string | Buffer): T {
		return this.parser.parse(xmlContent) as T;
	}
}

export class JsonContentParser implements ContentParser {
	public parse<T>(jsonContent: string): T {
		return JSON.parse(jsonContent) as T;
	}
}
