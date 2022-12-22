import {
    ChargerAnnoncesDeLogementDomainService,
} from "@logements/chargement/domain/1jeune1solution/services/charger-annonces-de-logement.domain-service";
import { GatewayContainer } from "@logements/chargement/infrastructure/gateway";
import { UsecaseContainer } from "@logements/chargement/usecase";
import { ChargerFluxImmojeune } from "@logements/chargement/usecase/charger-flux-immojeune.usecase";

export class UseCaseContainerFactory {
    public static create(gateways: GatewayContainer): UsecaseContainer {
        const chargerAnnoncesDeLogement = new ChargerAnnoncesDeLogementDomainService(gateways.annonceDeLogementRepository);

        return {
            immojeune: new ChargerFluxImmojeune(chargerAnnoncesDeLogement),
        };
    }
}
