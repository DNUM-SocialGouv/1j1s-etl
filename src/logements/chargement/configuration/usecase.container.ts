import { GatewayContainer } from "@logements/chargement/infrastructure/gateway";
import { UsecaseContainer } from "@logements/chargement/usecase";
import { ChargerFluxImmojeune } from "@logements/chargement/usecase/charger-flux-immojeune.usecase";

export class UseCaseContainerFactory {

    public static create(gateways: GatewayContainer): UsecaseContainer {
        return {
            immojeune: new ChargerFluxImmojeune(gateways.annonceDeLogementRepository),
        };
    }
}
