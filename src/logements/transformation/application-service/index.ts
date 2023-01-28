import { TransformerFluxImmojeune } from "@logements/transformation/application-service/transformer-flux-immojeune.usecase";
import { TransformerFluxStudapartUseCase } from "@logements/transformation/application-service/transformer-flux-studapart.usecase";

export type UsecaseContainer = {
	transformerFluxImmojeune: TransformerFluxImmojeune
	transformerFluxStudapart: TransformerFluxStudapartUseCase
}
