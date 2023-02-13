import { TransformerFluxImmojeune } from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import { TransformerFluxStudapartUseCase } from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";

export type UsecaseContainer = {
	transformerFluxImmojeune: TransformerFluxImmojeune
	transformerFluxStudapart: TransformerFluxStudapartUseCase
}
