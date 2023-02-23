import TurndownService from "turndown";

import { UsecaseContainer } from "@logements/src/transformation/application-service";
import {
	TransformerFluxImmojeune,
} from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import {
	TransformerFluxStudapartUseCase,
} from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";
import {
	Convertir as ConvertirImmojeune,
} from "@logements/src/transformation/domain/service/immojeune/convertir.domain-service";
import {
	Convertir as ConvertirStudapart,
} from "@logements/src/transformation/domain/service/studapart/convertir.domain-service";
import { GatewayContainer } from "@logements/src/transformation/infrastructure/gateway";

import { DateService } from "@shared/src/date.service";
import { HtmlToMarkdownSanitizer } from "@shared/src/infrastructure/gateway/html-to-markdown.sanitizer";

export class UsecasesContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const htmlToMarkdownSanitizer = new HtmlToMarkdownSanitizer(new TurndownService());
		const dateService = new DateService();

		return {
			transformerFluxImmojeune: new TransformerFluxImmojeune(
				gateways.annonceDeLogementRepository,
				new ConvertirImmojeune(htmlToMarkdownSanitizer, dateService),
			),
			transformerFluxStudapart: new TransformerFluxStudapartUseCase(
				gateways.annonceDeLogementRepository,
				new ConvertirStudapart(htmlToMarkdownSanitizer, dateService)
			),
		};
	}
}
