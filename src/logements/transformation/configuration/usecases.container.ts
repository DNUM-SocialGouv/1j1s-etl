import { GatewayContainer } from "@logements/transformation/infrastructure/gateway";
import { UsecaseContainer } from "@logements/transformation/usecase";
import { DateService } from "@shared/date.service";
import { TransformerFluxImmojeune } from "@logements/transformation/usecase/transformer-flux-immojeune.usecase";
import { Immojeune } from "@logements/transformation/domain/immojeune";
import { HtmlToMarkdownSanitizer } from "@shared/infrastructure/gateway/html-to-markdown.sanitizer";
import TurndownService from "turndown";

export class UsecasesContainerFactor {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const htmlToMarkdownSanitizer = new HtmlToMarkdownSanitizer(new TurndownService());
		const dateService = new DateService();

		return {
			transformerFluxImmojeune: new TransformerFluxImmojeune(
				gateways.annonceDeLogementRepository,
				new Immojeune.Convertir(htmlToMarkdownSanitizer, dateService),
			),
		};
	}
}
