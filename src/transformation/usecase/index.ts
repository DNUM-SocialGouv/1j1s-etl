import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";
import { TransformerFluxStagefrCompresse, } from "@transformation/usecase/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@transformation/usecase/transformer-flux-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	transformerFluxJobteaser: TransformerFluxJobteaser
	transformerFluxStagefrDecompresse: TransformerFluxStagefrDecompresse
	transformerFluxStagefrCompresse: TransformerFluxStagefrCompresse
}
