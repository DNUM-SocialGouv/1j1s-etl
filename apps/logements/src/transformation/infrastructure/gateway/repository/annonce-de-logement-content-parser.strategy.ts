import {
  ContentParserStrategy, ContentParserStrategyError,
  JsonContentParser,
  XmlContentParser,
} from "@shared/src/infrastructure/gateway/content.parser";
import { Flux } from "@shared/src/flux";

export class AnnonceDeLogementContentParserStrategy implements ContentParserStrategy {

  constructor(
    private readonly xmlContentParser: XmlContentParser,
    private readonly jsonContentParser: JsonContentParser,
  ) {
  }

  get<T>(flux: Flux, content: string | Buffer): T {
    switch (flux.nom) {
      case "immojeune": return this.jsonContentParser.parse<T>(content.toString("utf8"));
      case "studapart": return this.xmlContentParser.parse<T>(content);
      default: throw new ContentParserStrategyError(flux.nom);
    }
  }

}

/**
 @doc https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md#isarray
 */
export class StudapartOptionXmlParser {
  public static consideTagAsArray(name: string, jpath: string): boolean {
    const alwaysConsideredTagsAsArray = [
      "unjeuneunesolution.item.rooms",
      "unjeuneunesolution.item.pictures",
    ];
    return alwaysConsideredTagsAsArray.indexOf(jpath) !== -1;
  }
}
