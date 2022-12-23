import { ChargerFluxImmojeune } from "@logements/chargement/usecase/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/chargement/usecase/charger-flux-studapart.usecase";

export type UsecaseContainer = {
    immojeune: ChargerFluxImmojeune
    studapart: ChargerFluxStudapart
}
