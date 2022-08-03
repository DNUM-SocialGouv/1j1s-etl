import { XMLParser } from "fast-xml-parser";

export interface ContentParser {
	parse<T>(xmlContent: string | Buffer): Promise<T>;
}

export class XmlContentParser implements ContentParser {
	constructor(private readonly parser: XMLParser,) {
	}

	parse<T>(xmlContent: string | Buffer): T {
		return this.parser.parse(xmlContent) as T;
	}
}
