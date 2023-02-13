import { TransformerFluxStagefrCompresse } from "./transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "./transformer-flux-stagefr-decompresse.usecase";
import { TransformerFluxJobteaser } from "./transformer-flux-jobteaser.usecase";

export type UsecaseContainer = {
	transformerFluxJobteaser: TransformerFluxJobteaser
	transformerFluxStagefrDecompresse: TransformerFluxStagefrDecompresse
	transformerFluxStagefrCompresse: TransformerFluxStagefrCompresse
}
