import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@transformation/infrastructure/gateway";
import { Jobteaser } from "@transformation/domain/jobteaser";
import { StagefrCompresse } from "@transformation/domain/stagefr-compresse";
import { StagefrDecompresse } from "@transformation/domain/stagefr-decompresse";
import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrCompresse,
} from "@transformation/usecase/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@transformation/usecase/transformer-flux-stagefr-decompresse.usecase";
import { UsecaseContainer } from "@transformation/usecase";

export class UsecaseContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
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
