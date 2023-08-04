import { Module } from "@nestjs/common";

import {
	ChargerFluxOnisep,
} from "@formations-initiales/src/chargement/application-service/charger-flux-onisep.usecase";
import {
	ChargerFormationsInitialesDomainService,
} from "@formations-initiales/src/chargement/domain/service/charger-formations-initiales.domain-service";
import {
	FormationsInitialesChargementRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales-chargement.repository";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";

import { Gateway } from "@formations-initiales/src/chargement/infrastructure/gateway";

@Module({
	exports: [ChargerFluxOnisep],
	imports: [Gateway, Shared],
	providers: [
		{
			provide: ChargerFormationsInitialesDomainService,
			inject: ["FormationsInitialesChargementRepository", DateService],
			useFactory: (
				formationsInitialesRepository: FormationsInitialesChargementRepository,
				dateService: DateService,
			): ChargerFormationsInitialesDomainService => {
				return new ChargerFormationsInitialesDomainService(formationsInitialesRepository, dateService);
			},
		},
		{
			provide: ChargerFluxOnisep,
			inject: [ChargerFormationsInitialesDomainService],
			useFactory: (chargerFormationsInitialesDomainService: ChargerFormationsInitialesDomainService): ChargerFluxOnisep => {
				return new ChargerFluxOnisep(chargerFormationsInitialesDomainService);
			},
		},
	],
})
export class Usecases {
}
