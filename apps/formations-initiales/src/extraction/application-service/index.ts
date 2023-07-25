import { Module } from "@nestjs/common";

import {
  ExtraireFluxFormationsInitialesOnisep,
} from "@formations-initiales/src/extraction/application-service/extraire-flux-formations-initiales-onisep.usecase";
import {
  ExtraireFluxDomainService,
} from "@formations-initiales/src/extraction/domain/service/extraire-flux.domain-service";
import { FluxRepository } from "@formations-initiales/src/extraction/domain/service/flux.repository";
import { Gateways } from "@formations-initiales/src/extraction/infrastructure/gateway";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";

@Module({
  imports: [Gateways, Shared],
  providers: [{
    provide: ExtraireFluxDomainService,
    inject: ["FluxRepository", DateService],
    useFactory: (fluxRepository: FluxRepository, dateService: DateService): ExtraireFluxDomainService => {
      return new ExtraireFluxDomainService(fluxRepository, dateService);
    },
  }, {
    provide: ExtraireFluxFormationsInitialesOnisep,
    inject: [ExtraireFluxDomainService],
    useFactory: (extraireFluxDomainService: ExtraireFluxDomainService): ExtraireFluxFormationsInitialesOnisep => {
      return new ExtraireFluxFormationsInitialesOnisep(extraireFluxDomainService);
    },
  }],
  exports: [ExtraireFluxFormationsInitialesOnisep],
})
export class Usecases {
}
