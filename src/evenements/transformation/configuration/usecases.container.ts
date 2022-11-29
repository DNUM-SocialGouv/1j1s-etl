import TurndownService from "turndown";

import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@evenements/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/infrastructure/gateway/html-to-markdown.sanitizer";
import {
	TransformerFluxTousMobilisesUseCase,
} from "@evenements/transformation/usecase/transformer-flux-tous-mobilises-use.case";
import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import { UseCaseContainer } from "@evenements/transformation/usecase";

export class UseCaseContainerFactory {
	public static create(gateways: GatewayContainer): UseCaseContainer {
		const htmlToMarkdown = new TurndownService();
		const assainisseurDeTexte = new HtmlToMarkdownSanitizer(htmlToMarkdown);
		const mapper = new TousMobilises.Convertir(new DateService(), assainisseurDeTexte);
		return {
			transformerFluxTousMobilisesUsecase: new TransformerFluxTousMobilisesUseCase(
				gateways.evenementsRepository,
				mapper
			),
		};
	}
}
