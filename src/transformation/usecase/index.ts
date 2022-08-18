import { TransformerFluxJobteaser } from "@transformation/usecase/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrDecompresse
} from "@transformation/usecase/transformer-flux-stagefr-decompresse.usecase";

export type UsecaseContainer = {
	transformerFluxJobteaser: TransformerFluxJobteaser
	transformerFluxStagerfrDecompresse: TransformerFluxStagefrDecompresse
}
