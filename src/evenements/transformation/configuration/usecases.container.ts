import { Convertir } from "@evenements/transformation/domain/service/tous-mobilises/convertir.domain-service";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@evenements/transformation/infrastructure/gateway";
import { HtmlToMarkdownSanitizer } from "@shared/infrastructure/gateway/html-to-markdown.sanitizer";
import {
	TransformerFluxTousMobilises,
} from "@evenements/transformation/application-service/transformer-flux-tous-mobilises.usecase";
import TurndownService from "turndown";
import { UseCaseContainer } from "@evenements/transformation/application-service";

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
