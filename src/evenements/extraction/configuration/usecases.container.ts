import { DateService } from "@shared/date.service";
import {
	ExtraireEvenementTousMobilisesUsecase,
} from "@evenements/extraction/usecase/extraire-evenement-tous-mobilises.usecase";
import { ExtraireFluxDomainService } from "@evenements/extraction/domain/services/extraire-flux.domain-service";
import { GatewayContainer } from "@evenements/extraction/infrastucture/gateway";
import { UsecaseContainer } from "@evenements/extraction/usecase";

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
