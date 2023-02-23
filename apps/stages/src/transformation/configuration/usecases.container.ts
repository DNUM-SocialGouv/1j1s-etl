import { DateService } from "@shared/src/date.service";

import { UsecaseContainer } from "@stages/src/transformation/application-service";
import {
	TransformerFluxJobteaser,
} from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrCompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import { Convertir as ConvertirJobteaser } from "@stages/src/transformation/domain/service/jobteaser/convertir.domain-service";
import { Convertir as ConvertirStagefrCompresse } from "@stages/src/transformation/domain/service/stagefr-compresse/convertir.domain-service";
import {
	Convertir as ConvertirStagefrDecompresse,
} from "@stages/src/transformation/domain/service/stagefr-decompresse/convertir.domain-service";
import { GatewayContainer } from "@stages/src/transformation/infrastructure/gateway";

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
