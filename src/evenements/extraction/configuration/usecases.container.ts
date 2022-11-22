import {DateService} from "@shared/date.service";
import {ExtraireFluxDomainService} from "@evenements/extraction/domain/services/extraire-flux.domain-service";

import {UsecaseContainer} from "@evenements/extraction/usecase";
import {
	ExtraireEvenementTousMobilisesUsecase,
} from "@evenements/extraction/usecase/extraire-evenementTousMobilises.usecase";
import {GatewayContainer} from "@evenements/extraction/infrastucture/gateway";

export class UsecaseContainerFactory {
    public static create(gateways: GatewayContainer): UsecaseContainer {
        const dateService = new DateService();

        const extraireFluxDomainService = new ExtraireFluxDomainService(
            gateways.repositories.flowRepository,
            dateService
        );

        return {
            extraireEvenementsTousMobilises: new ExtraireEvenementTousMobilisesUsecase(extraireFluxDomainService),
        };
    }
}
