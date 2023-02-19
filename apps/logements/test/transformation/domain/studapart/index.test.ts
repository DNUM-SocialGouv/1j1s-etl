import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import {
    AnnonceDeLogementFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement.fixture-builder";
import {
    AnnonceDeLogementStudapartFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement-studapart.fixture-builder";
import { Convertir } from "@logements/src/transformation/domain/service/studapart/convertir.domain-service";
import { DateService } from "@shared/src/date.service";
import { expect, sinon, stubClass, StubbedType, stubInterface } from "@test/configuration";
import { Studapart } from "@logements/src/transformation/domain/model/studapart";
import { StudapartBoolean } from "@logements/src/transformation/domain/model/studapart/studapart-boolean.value-object";
import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";

let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let convertir: Convertir;
let dateService: StubbedType<DateService>;

describe("StudapartTest", () => {
    beforeEach(() => {
        assainisseurDeTexte = stubInterface(sinon);
        assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");

        dateService = stubClass(DateService);
        dateService.stringifyMaintenant.returns("2022-12-01T00:00:00.000Z");
        dateService.toIsoDateAvecDate.restore();

        convertir = new Convertir(assainisseurDeTexte, dateService);
    });

    context("Lorsque je reçois une annonce studapart de type apartment, rental et avec une seule room", () => {
        it("je retourne un logement UnJeuneUneSolution de type Appartement avec la garantie de la première pièce", () => {
            const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build();
            const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
              {
                  source: UnJeune1Solution.Source.STUDAPART,
                  servicesOptionnels: [],
                  prixHT: 0,
                  servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
                  surfaceMax: undefined,
              }
            );

            const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

            expect(result).to.deep.equal(expected);
        });
    });

    context("Lorsque je reçois une annonce studapart de type house, homestay avec plusieurs pièces et 2 étages", () => {
        it("je retourne un logement UnJeuneUneSolution de type Maison avec 2 étages avec la plus petite garantie de la liste de chambre", () => {
            const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build(
                {
                    property_type: "house",
                    floor_number: "2",
                    announcement_type: "homestay",
                    rooms: [{ deposit: "250" }, { deposit: "200" }],
                }
            );
            const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
                {
                    source: UnJeune1Solution.Source.STUDAPART,
                    servicesOptionnels: [],
                    prixHT: 0,
                    servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
                    surfaceMax: undefined,
                    typeBien: UnJeune1Solution.TypeBien.MAISON,
                    etage: 2,
                    type: UnJeune1Solution.Type.LOGEMENT_CHEZ_L_HABITANT,
                    garantie: 200,
                }
            );

            const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

            expect(result).to.deep.equal(expected);
        });
    });

    context("Lorsque je reçois une annonce studapart de type service, avec toutes les options", () => {
        it("je retourne un logement UnJeuneUneSolution avec tous les services inclus", () => {
            const trueValueFromStudapart = new StudapartBoolean("1");
            const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build(
                {
                    announcement_type: "service",
                    options: {
                        tv: trueValueFromStudapart,
                        basement: trueValueFromStudapart,
                        dish_washer: trueValueFromStudapart,
                        oven: trueValueFromStudapart,
                        dryer: trueValueFromStudapart,
                        elevator: trueValueFromStudapart,
                        garage: trueValueFromStudapart,
                        terrace: trueValueFromStudapart,
                        optic_fiber: trueValueFromStudapart,
                        guardian: trueValueFromStudapart,
                        micro_wave: trueValueFromStudapart,
                        refrigerator: trueValueFromStudapart,
                        washing_machine: trueValueFromStudapart,
                        fitness_room: trueValueFromStudapart,
                        swimming_pool: trueValueFromStudapart,
                    },
                }
            );
            const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
                {
                    source: UnJeune1Solution.Source.STUDAPART,
                    servicesOptionnels: [],
                    prixHT: 0,
                    surfaceMax: undefined,
                    type: UnJeune1Solution.Type.LOGEMENT_CONTRE_SERVICES,
                    servicesInclus: [
                        { nom: UnJeune1Solution.ServiceInclus.Nom.TV },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.CAVE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.LAVE_VAISSELLE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.FOUR },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.SECHE_LINGE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.ASCENSEUR },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.GARAGE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.TERRASSE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.FIBRE_OPTIQUE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.GARDIEN_RESIDENCE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.MICRO_ONDE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.REFRIGERATEUR },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.LAVE_LINGE },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.SALLE_DE_SPORT },
                        { nom: UnJeune1Solution.ServiceInclus.Nom.PISCINE },
                    ],
                }
            );

            const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

            expect(result).to.deep.equal(expected);
        });
    });

    context("Lorsque je reçois une annonce sans pièce", () => {
      it("je retourne un logement UnJeuneUneSolution avec un nombre de pièce à 0", () => {
        const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build({ rooms: undefined });
        const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
          {
            source: UnJeune1Solution.Source.STUDAPART,
            servicesOptionnels: [],
            prixHT: 0,
            servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
            surfaceMax: undefined,
            garantie: 0,
          }
        );

        const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

        expect(result).to.deep.equal(expected);
      });
    });

    context("Lorsque je reçois une annonce sans optionLogement", () => {
      it("je retourne un logement UnJeuneUneSolution avec des services à vide", () => {
        const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build({ options: undefined });
        const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
          {
            source: UnJeune1Solution.Source.STUDAPART,
            servicesOptionnels: [],
            prixHT: 0,
            servicesInclus: [],
            surfaceMax: undefined,
          }
        );

        const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

        expect(result).to.deep.equal(expected);
      });
    });
});