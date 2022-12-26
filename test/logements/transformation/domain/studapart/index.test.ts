import { Studapart } from "@logements/transformation/domain/studapart";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import { DateService } from "@shared/date.service";
import { AssainisseurDeTexte } from "@shared/assainisseur-de-texte";
import { expect, stubClass } from "@test/configuration";
import sinon from "sinon";
import { UnJeune1Solution } from "@logements/transformation/domain/1jeune1solution";
import {
    AnnonceDeLogementStudapartFixtureBuilder,
} from "@test/logements/transformation/fixture/annonce-de-logement-studapart.fixture-builder";
import {
    AnnonceDeLogementFixtureBuilder,
} from "@test/logements/transformation/fixture/annonce-de-logement.fixture-builder";
import { StudapartBoolean } from "@logements/transformation/domain/studapart/studapart-boolean";
import Nom = UnJeune1Solution.ServiceInclus.Nom;

let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let dateService: StubbedType<DateService>;

let convertir: Studapart.Convertir;
describe("StudapartTest", () => {

    

    beforeEach(() => {
        assainisseurDeTexte = stubInterface(sinon);
        assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");

        dateService = stubClass(DateService);
        dateService.stringifyMaintenant.returns("2022-12-01T00:00:00.000Z");
        dateService.toIsoDateAvecDate.restore();

        convertir = new Studapart.Convertir(assainisseurDeTexte, dateService);
    });

    context("Lorsque je reçois une annonce studapart de type apartment, rental et avec une seule room", () => {
        it("je retourne un logement UnJeuneUneSolution de type Appartement avec la garantie de la première pièce", () => {
            const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build();
            const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
              {
                  source: UnJeune1Solution.Source.STUDAPART,
                  servicesOptionnels: [],
                  prixHT: 0,
                  servicesInclus: [{ nom: Nom.TV }],
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
                    servicesInclus: [{ nom: Nom.TV }],
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
                        { nom: UnJeune1Solution.ServiceInclus.Nom.TERRACE },
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
            servicesInclus: [{ nom: Nom.TV }],
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
