import { Module } from "@nestjs/common";

import { Shared } from "@shared/src";
import { DateService } from "@shared/src/domain/service/date.service";

import {
  ExtraireFluxDomainService,
} from "../domain/service/extraire-flux.domain-service";
import { FluxRepository } from "../domain/service/flux.repository";
import { Gateways } from "../infrastructure/gateway";
import {
  ExtraireFluxFormationsInitialesOnisep,
} from "./extraire-flux-formations-initiales-onisep.usecase";

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
