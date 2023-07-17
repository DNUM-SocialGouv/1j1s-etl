import { Module } from "@nestjs/common";

import {
  TransformerFluxOnisep,
} from "@formations-initiales/src/transformation/application-service/transformer-flux-onisep.usecase";
import {
  FormationsInitialesRepository,
} from "@formations-initiales/src/transformation/domain/service/formations-initiales.repository";
import { Convertir } from "@formations-initiales/src/transformation/domain/service/onisep/convertir.domain-service";
import { Gateways } from "@formations-initiales/src/transformation/infrastructure/gateway";

import { Shared } from "@shared/src";

@Module({
  imports: [Gateways, Shared],
  providers: [{
    provide: Convertir,
    inject: [],
    useFactory: (): Convertir => {
      return new Convertir();
    },
  }, {
    provide: TransformerFluxOnisep,
    inject: [
      "FormationsInitialesRepository",
      Convertir,
    ],
    useFactory: (formationsInitialesRepository: FormationsInitialesRepository, convertirDomainService: Convertir): TransformerFluxOnisep => {
      return new TransformerFluxOnisep(formationsInitialesRepository, convertirDomainService);
    },
  }],
  exports: [TransformerFluxOnisep],
})
export class Usecases {
}
