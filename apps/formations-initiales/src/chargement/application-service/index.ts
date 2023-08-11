import { Module } from "@nestjs/common";

import {
	ChargerFluxOnisep,
} from "@formations-initiales/src/chargement/application-service/charger-flux-onisep.usecase";
import {
	ChargerFormationsInitialesDomainService,
} from "@formations-initiales/src/chargement/domain/service/charger-formations-initiales.domain-service";
import {
	FormationsInitialesRepository,
} from "@formations-initiales/src/chargement/domain/service/formations-initiales.repository";
import { Gateway } from "@formations-initiales/src/chargement/infrastructure/gateway";

import { Shared } from "@shared/src";

@Module({
	exports: [ChargerFluxOnisep],
	imports: [Gateway, Shared],
	providers: [
		{
			provide: ChargerFormationsInitialesDomainService,
			inject: ["FormationsInitialesRepository"],
			useFactory: (
				formationsInitialesRepository: FormationsInitialesRepository,
			): ChargerFormationsInitialesDomainService => {
				return new ChargerFormationsInitialesDomainService(formationsInitialesRepository);
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
