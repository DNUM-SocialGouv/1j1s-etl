import { ChargerFluxJobteaser } from "@stages/chargement/application-service/charger-flux-jobteaser.usecase";
import { ChargerFluxStagefrCompresse } from "@stages/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import { ChargerFluxStagefrDecompresse } from "@stages/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import {
	ChargerOffresDeStageDomainService,
} from "@stages/chargement/domain/service/charger-offres-de-stage.domain-service";
import { DateService } from "@shared/date.service";
import { GatewayContainer } from "@stages/chargement/infrastructure/gateway";
import { UsecaseContainer } from "@stages/chargement/application-service";

export class UsecaseContainerFactory {
	public static create(gateways: GatewayContainer): UsecaseContainer {
		const dateService = new DateService();
		const chargerOffresDeStageDomainService = new ChargerOffresDeStageDomainService(
			gateways.offreDeStageRepository,
			dateService
		);

		return {
			chargerFluxJobteaser: new ChargerFluxJobteaser(chargerOffresDeStageDomainService),
			chargerFluxStagefrCompresse: new ChargerFluxStagefrCompresse(chargerOffresDeStageDomainService),
			chargerFluxStagefrDecompresse: new ChargerFluxStagefrDecompresse(chargerOffresDeStageDomainService),
		};
	}
}
