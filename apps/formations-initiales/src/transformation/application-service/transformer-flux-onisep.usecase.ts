import { FluxTransformation } from "@formations-initiales/src/transformation/domain/model/flux";
import { Onisep } from "@formations-initiales/src/transformation/domain/model/onisep";
import {
  FormationsInitialesRepository,
} from "@formations-initiales/src/transformation/domain/service/formations-initiales.repository";
import { Convertir } from "@formations-initiales/src/transformation/domain/service/onisep/convertir.domain-service";

import { Usecase } from "@shared/src/application-service/usecase";

export class TransformerFluxOnisep implements Usecase {
  constructor(
    private readonly formationsInitialesRepository: FormationsInitialesRepository,
    private readonly convertir: Convertir,
  ) {
  }

  public async executer(flux: FluxTransformation): Promise<void> {
    const contenuDuFlux = await this.formationsInitialesRepository.recuperer<Onisep.Contenu>(flux);

    await this.formationsInitialesRepository.sauvegarder(this.convertir.depuisOnisep(contenuDuFlux), flux);
  }
}
