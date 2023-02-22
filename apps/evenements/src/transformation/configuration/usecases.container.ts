import TurndownService from "turndown";

import { Convertir } from "@evenements/src/transformation/domain/service/tous-mobilises/convertir.domain-service";
import { DateService } from "@shared/src/date.service";
import { GatewayContainer } from "@evenements/src/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/src/infrastructure/gateway/html-to-markdown.sanitizer";
import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import { UseCaseContainer } from "@evenements/src/transformation/application-service";

export class UseCaseContainerFactory {
	public static create(gateways: GatewayContainer): UseCaseContainer {
		const htmlToMarkdown = new TurndownService();
		const assainisseurDeTexte = new HtmlToMarkdownSanitizer(htmlToMarkdown);
		const convertirTousMobilises = new Convertir(new DateService(), assainisseurDeTexte);
		return {
			transformerFluxTousMobilisesUsecase: new TransformerFluxTousMobilises(
				gateways.evenementsRepository,
				convertirTousMobilises
			),
		};
	}
}
