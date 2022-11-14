import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@stages/transformation/infrastructure/gateway";
import { Jobteaser } from "@stages/transformation/domain/jobteaser";
import { StagefrCompresse } from "@stages/transformation/domain/stagefr-compresse";
import { StagefrDecompresse } from "@stages/transformation/domain/stagefr-decompresse";
import { TransformerFluxJobteaser } from "@stages/transformation/usecase/transformer-flux-jobteaser.usecase";
import { TransformerFluxStagefrCompresse } from "@stages/transformation/usecase/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "../usecase/transformer-flux-stagefr-decompresse.usecase";
import { UsecaseContainer } from "../usecase";

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
