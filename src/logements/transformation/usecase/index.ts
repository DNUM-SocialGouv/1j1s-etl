import { TransformerFluxImmojeune } from "@logements/transformation/usecase/transformer-flux-immojeune.usecase";
import { TransformerFluxStudapartUseCase } from "@logements/transformation/usecase/transformer-flux-studapart.usecase";

export type UsecaseContainer = {
	transformerFluxImmojeune: TransformerFluxImmojeune
	transformerFluxStudapart: TransformerFluxStudapartUseCase
}
