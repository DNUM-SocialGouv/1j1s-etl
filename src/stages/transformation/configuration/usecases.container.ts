import { Convertir as ConvertirJobteaser } from "@stages/transformation/domain/service/jobteaser/convertir.domain-service";
import { Convertir as ConvertirStagefrCompresse } from "@stages/transformation/domain/service/stagefr-compresse/convertir.domain-service";
import {
	Convertir as ConvertirStagefrDecompresse,
} from "@stages/transformation/domain/service/stagefr-decompresse/convertir.domain-service";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@stages/transformation/infrastructure/gateway";
import {
	TransformerFluxJobteaser,
} from "@stages/transformation/application-service/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrCompresse,
} from "@stages/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import { UsecaseContainer } from "@stages/transformation/application-service";

export class UsecaseContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();
		const convertirOffreDeStageJobteaser = new ConvertirJobteaser(
			dateService,
			gateways.textSanitizer,
			gateways.country
		);
		const convertirOffreDeStageStagefrCompresse = new ConvertirStagefrCompresse(
			dateService,
			gateways.textSanitizer
		);
		const convertirOffreDeStageStagefrDecompresse = new ConvertirStagefrDecompresse(
			dateService,
			gateways.textSanitizer
		);

		return {
			transformerFluxJobteaser: new TransformerFluxJobteaser(
				gateways.offreDeStageRepository,
				convertirOffreDeStageJobteaser
			),
			transformerFluxStagefrCompresse: new TransformerFluxStagefrCompresse(
				gateways.offreDeStageRepository,
				convertirOffreDeStageStagefrCompresse
			),
			transformerFluxStagefrDecompresse: new TransformerFluxStagefrDecompresse(
				gateways.offreDeStageRepository,
				convertirOffreDeStageStagefrDecompresse,
			),
		};
	}
}
