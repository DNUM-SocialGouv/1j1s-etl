import { expect, sinon, StubbedType, stubInterface } from "@test/library";

import {
  TransformerFluxOnisep,
} from "@formations-initiales/src/transformation/application-service/transformer-flux-onisep.usecase";
import { FluxTransformation } from "@formations-initiales/src/transformation/domain/model/flux";
import { Onisep } from "@formations-initiales/src/transformation/domain/model/onisep";
import {
  FormationsInitialesRepository,
} from "@formations-initiales/src/transformation/domain/service/formations-initiales.repository";
import { Convertir } from "@formations-initiales/src/transformation/domain/service/onisep/convertir.domain-service";

describe("TransformerFluxOnisepUseCase", () => {
  let usecase: TransformerFluxOnisep;
  let repo: StubbedType<FormationsInitialesRepository>;
  let flux: FluxTransformation;

  const aFluxOnisep: Onisep.Contenu = {
    formations: {
      formation: [
        {
          identifiant: "identifiant",
          libelle_complet: "libelle_complet",
          duree_formation: "duree_formation",
          niveau_certification: "niveau_certification",
          niveau_etudes: { libelle: "niveau_etudes" },
          descriptif_format_court: "descriptif_format_court",
          attendus: "attendus",
          descriptif_acces: "descriptif_acces",
          descriptif_poursuite_etudes: "descriptif_poursuite_etudes",
        },
      ],
    },
  };

  beforeEach(() => {
    repo = stubInterface<FormationsInitialesRepository>(sinon);
    flux = new FluxTransformation("onisep", "history", ".xml", ".json");

    usecase = new TransformerFluxOnisep(repo, new Convertir());
  });

  context("Lorsque je récupère le flux provenant de onisep", () => {
    beforeEach(() => {
      repo.recuperer.resolves(aFluxOnisep);
    });

    it("je retourne une liste de formations initiales d'un jeune une solution", async () => {
      await usecase.executer(flux);

      expect(repo.sauvegarder).to.have.been.calledWithMatch([{
          identifiant: "identifiant",
          intitule: "libelle_complet",
          duree: "duree_formation",
          certification: "niveau_certification",
          niveauEtudesVise: "niveau_etudes",
          description: "descriptif_format_court",
          attendusParcoursup: "attendus",
          conditionsAcces: "descriptif_acces",
          poursuiteEtudes: "descriptif_poursuite_etudes",
      }],
      flux);
    });
  });
});
