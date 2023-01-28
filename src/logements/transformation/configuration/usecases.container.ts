import {
	Convertir as ConvertirImmojeune,
} from "@logements/transformation/domain/service/immojeune/convertir.domain-service";
import {
	Convertir as ConvertirStudapart,
} from "@logements/transformation/domain/service/studapart/convertir.domain-service";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@logements/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/infrastructure/gateway/html-to-markdown.sanitizer";
import {
	TransformerFluxImmojeune,
} from "@logements/transformation/application-service/transformer-flux-immojeune.usecase";
import {
	TransformerFluxStudapartUseCase,
} from "@logements/transformation/application-service/transformer-flux-studapart.usecase";
import TurndownService from "turndown";
import { UsecaseContainer } from "@logements/transformation/application-service";

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
