import { FluxExtraction } from "@formations-initiales/src/extraction/domain/model/flux";
import { FluxRepository } from "@formations-initiales/src/extraction/domain/service/flux.repository";

import { DateService } from "@shared/src/domain/service/date.service";

export class ExtraireFluxDomainService {
  private static readonly SEPARATEUR_DE_CHEMIN = "/";
  private static readonly NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE = "latest";

  constructor(
    private readonly fluxRepository: FluxRepository,
    private readonly dateService: DateService,
  ) {
  }

  public async extraire(flux: FluxExtraction): Promise<void> {
    const contenuDuFlux = await this.fluxRepository.recuperer(flux);
    await this.sauvegarderLeFlux(flux, contenuDuFlux);
  }

  private async sauvegarderLeFlux(flux: FluxExtraction, contenuDuFlux: string): Promise<void> {
    await this.historiserLeFlux(flux, contenuDuFlux);
    await this.sauvegarderDerniereVersionDuFlux(flux, contenuDuFlux);
  }

  private async historiserLeFlux(flux: FluxExtraction, contenuDuFlux: string): Promise<void> {
    const nomDuFichierHistorise = this.creerNomDuFichierAHistoriser(flux);
    await this.fluxRepository.enregistrer(nomDuFichierHistorise, contenuDuFlux, flux);
  }

  private async sauvegarderDerniereVersionDuFlux(flux: FluxExtraction, contenuDuFlux: string): Promise<void> {
    const nomDuDernierFicher = this.creerNomDuDernierFichier(flux);
    await this.fluxRepository.enregistrer(nomDuDernierFicher, contenuDuFlux, flux);
  }

  private creerNomDuFichierAHistoriser(flux: FluxExtraction): string {
    const { SEPARATEUR_DE_CHEMIN } = ExtraireFluxDomainService;
    const nomDuFichierHistorise = flux.nom
      .concat(SEPARATEUR_DE_CHEMIN)
      .concat(flux.dossierHistorisation)
      .concat(SEPARATEUR_DE_CHEMIN)
      .concat(this.dateService.maintenant().toISOString())
      .concat(flux.extension);
    return nomDuFichierHistorise;
  }

  private creerNomDuDernierFichier(flux: FluxExtraction): string {
    const {
      SEPARATEUR_DE_CHEMIN,
      NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE,
    } = ExtraireFluxDomainService;
    const nomDuDernierFicher = flux.nom
      .concat(SEPARATEUR_DE_CHEMIN)
      .concat(NOM_DE_LA_DERNIERE_VERSION_DU_FICHIER_CLONE)
      .concat(flux.extension);
    return nomDuDernierFicher ;
  }
}
