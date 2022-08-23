import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@transformation/usecase/transformer-flux-stagefr-decompresse.usecase";
import { StagefrDecompresse } from "@transformation/domain/stagefr-decompresse";
import { UsecaseContainer } from "@transformation/usecase";
import { TransformerFluxStagefrCompresse } from "@transformation/usecase/transformer-flux-stagefr-compresse.usecase";
import { StagefrCompresse } from "@transformation/domain/stagefr-compresse";

export class UsecaseContainerFactory {
	static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();
		const convertirOffreDeStageJobteaser = new Jobteaser.Convertir(
			dateService,
			gateways.textSanitizer,
			gateways.country
		);
		const convertirOffreDeStageStagefrDecompresse = new StagefrDecompresse.Convertir(
			dateService,
			gateways.textSanitizer
		);
		const convertirOffreDeStageStagefrCompresse = new StagefrCompresse.Convertir(
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
