import { XMLParser } from "fast-xml-parser";
import { Flux } from "@shared/src/flux";

export interface ContentParser {
	parse<T>(content: string | Buffer): Promise<T>;
}

export interface ContentParserStrategy {
	get<T>(flux: Flux, content: string | Buffer): Promise<T>;
}

export class ContentParserStrategyError extends Error {
	constructor(flowName: string) {
		super(`No content parser available for flow ${flowName}`);
	}
}

export class XmlContentParser implements ContentParser {
	constructor(private readonly parser: XMLParser) {
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
