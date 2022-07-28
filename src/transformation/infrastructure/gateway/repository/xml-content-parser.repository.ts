import { XMLParser } from "fast-xml-parser";

export interface ContentParserRepository {
	parse<T>(xmlContent: string | Buffer): Promise<T>;
}

export class XmlParserContentRepository implements ContentParserRepository {
	constructor(private readonly parser: XMLParser,) {
	}

	parse<T>(xmlContent: string | Buffer): T {
		return this.parser.parse(xmlContent) as T;
	}
}
