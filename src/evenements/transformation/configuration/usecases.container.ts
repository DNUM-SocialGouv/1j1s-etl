import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@evenements/transformation/infrastructure/gateway";
import { UseCaseContainer } from "@evenements/transformation/usecase";
import {
	TransformerFluxTousMobilisesUseCase,
} from "@evenements/transformation/usecase/transformer-flux-tous-mobilises-use.case";
import { TousMobilises } from "@evenements/transformation/domain/tousmobilises";
import VersTousMobilises = TousMobilises.Convertir;
import TurndownService from "turndown";
import { HtmlToMarkdownSanitizer } from "@stages/transformation/infrastructure/gateway/html-to-markdown.sanitizer";

export class UseCaseContainerFactory {
	public static create(gateways: GatewayContainer): UseCaseContainer {
		const htmlToMarkdown = new TurndownService();
		const assainisseurDeTexte = new HtmlToMarkdownSanitizer(htmlToMarkdown);
		const mapper = new VersTousMobilises(new DateService(), assainisseurDeTexte);
		return {
			transformerFluxTousMobilisesUsecase: new TransformerFluxTousMobilisesUseCase(
				gateways.evenementsRepository,
				mapper
			),
		};
	}
}
