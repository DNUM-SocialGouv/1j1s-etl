import TurndownService from "turndown";

import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@logements/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/infrastructure/gateway/html-to-markdown.sanitizer";
import { Immojeune } from "@logements/transformation/domain/immojeune";
import { Studapart } from "@logements/transformation/domain/studapart";
import { TransformerFluxImmojeune } from "@logements/transformation/usecase/transformer-flux-immojeune.usecase";
import { TransformerFluxStudapartUseCase } from "@logements/transformation/usecase/transformer-flux-studapart.usecase";
import { UsecaseContainer } from "@logements/transformation/usecase";

export class UsecasesContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const htmlToMarkdownSanitizer = new HtmlToMarkdownSanitizer(new TurndownService());
		const dateService = new DateService();

		return {
			transformerFluxImmojeune: new TransformerFluxImmojeune(
				gateways.annonceDeLogementRepository,
				new Immojeune.Convertir(htmlToMarkdownSanitizer, dateService),
			),
			transformerFluxStudapart: new TransformerFluxStudapartUseCase(
				gateways.annonceDeLogementRepository,
				new Studapart.Convertir(htmlToMarkdownSanitizer, dateService)
			),
		};
	}
}
