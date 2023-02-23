import { TransformerFluxImmojeune } from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import { TransformerFluxStudapart } from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";

export type UsecaseContainer = {
	transformerFluxImmojeune: TransformerFluxImmojeune
	transformerFluxStudapart: TransformerFluxStudapart
}
