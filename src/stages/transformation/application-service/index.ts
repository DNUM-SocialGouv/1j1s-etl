import { TransformerFluxStagefrCompresse } from "@stages/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";
import { TransformerFluxJobteaser } from "@stages/transformation/application-service/transformer-flux-jobteaser.usecase";

export type UsecaseContainer = {
	transformerFluxJobteaser: TransformerFluxJobteaser
	transformerFluxStagefrDecompresse: TransformerFluxStagefrDecompresse
	transformerFluxStagefrCompresse: TransformerFluxStagefrCompresse
}
