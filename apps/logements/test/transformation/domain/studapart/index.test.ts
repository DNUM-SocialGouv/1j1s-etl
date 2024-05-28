import { Settings } from "luxon";

import { expect, sinon, SinonFakeTimers, StubbedType, stubInterface } from "@test/library";

import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";
import { Studapart } from "@logements/src/transformation/domain/model/studapart";
import { StudapartBoolean } from "@logements/src/transformation/domain/model/studapart/studapart-boolean.value-object";
import { Convertir } from "@logements/src/transformation/domain/service/studapart/convertir.domain-service";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement.fixture-builder";
import {
	AnnonceDeLogementStudapartFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement-studapart.fixture-builder";

import { AssainisseurDeTexte } from "@shared/src/domain/service/assainisseur-de-texte";
import { DateService } from "@shared/src/domain/service/date.service";

Settings.defaultZone = "Europe/London";

const maintenant = new Date("2022-12-01T01:00:00.000+01:00");
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let convertir: Convertir;
let clock: SinonFakeTimers;
let dateService: DateService;
let annonceDeLogementFromStudapartFixtureBase: Partial<UnJeune1Solution.AnnonceDeLogement>;

describe("StudapartTest", () => {
	beforeEach(() => {
		assainisseurDeTexte = stubInterface(sinon);
		assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");

		clock = sinon.useFakeTimers(maintenant);
		dateService = new DateService();

		convertir = new Convertir(assainisseurDeTexte, dateService);

		annonceDeLogementFromStudapartFixtureBase = {
			source: UnJeune1Solution.Source.STUDAPART,
			servicesOptionnels: [],
			prixHT: 0,
			surfaceMax: undefined,
		};
	});

	afterEach(() => {
		clock.restore();
	});

	context("Lorsque je reçois une annonce studapart sans le loyer minimum", () => {
		it("je retourne un logement UnJeuneUneSolution avec un loyer correspondant au loyer de l‘ensemble de la propriété", () => {
			const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build({
				min_rent_with_charges: "",
				full_property_rent_with_charges: "1500",
			});
			const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
				{
					source: UnJeune1Solution.Source.STUDAPART,
					servicesOptionnels: [],
					prix: 1500,
					prixHT: 0,
					servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
					surfaceMax: undefined,
				},
			);

			const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

			expect(result).to.deep.equal(expected);
		});
	});

	context("Lorsque je reçois une annonce studapart avec un loyer minimum", () => {
		it("je retourne un logement UnJeuneUneSolution avec un loyer correspondant au loyer minimum", () => {
			const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build({
				min_rent_with_charges: "1300",
				full_property_rent_with_charges: "1500",
			});
			const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
				{
					source: UnJeune1Solution.Source.STUDAPART,
					servicesOptionnels: [],
					prix: 1300,
					prixHT: 0,
					servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
					surfaceMax: undefined,
				},
			);

			const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

			expect(result).to.deep.equal(expected);
		});
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
				},
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
				},
			);
			const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
				{
					...annonceDeLogementFromStudapartFixtureBase,
					servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
					typeBien: UnJeune1Solution.TypeBien.MAISON,
					etage: 2,
					type: UnJeune1Solution.Type.LOGEMENT_CHEZ_L_HABITANT,
					garantie: 200,
				},
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
				},
			);
			const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
				{
					...annonceDeLogementFromStudapartFixtureBase,
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
				},
			);

			const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

			expect(result).to.deep.equal(expected);
		});
	});

	context("Lorsque je reçois une annonce studapart ayant un number en id (logement de type résidence)", () => {
		it("je retourne un logement UnJeuneUneSolution dont l’identifiantSource est une string", () => {
			const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build(
				{ id: 2809 },
			);
			const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
				{
					...annonceDeLogementFromStudapartFixtureBase,
					identifiantSource: "2809",
				},
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
					...annonceDeLogementFromStudapartFixtureBase,
					servicesInclus: [{ nom: UnJeune1Solution.ServiceInclus.Nom.TV }],
					garantie: 0,
				},
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
					...annonceDeLogementFromStudapartFixtureBase,
					servicesInclus: [],
				},
			);

			const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

			expect(result).to.deep.equal(expected);
		});
	});

	context("Lorsque je reçois une annonce avec des éléments de bilan énergétique à 0", () => {
		it("je retourne un logement avec les éléments correspondants à undefined", () => {
			const annonceDeLogementStudapart: Studapart.AnnonceDeLogement = AnnonceDeLogementStudapartFixtureBuilder.build({
				energy_consumption: 0,
				greenhouse_gases_emission: 0,
			});

			const expected: UnJeune1Solution.AnnonceDeLogement = AnnonceDeLogementFixtureBuilder.build(
				{
					...annonceDeLogementFromStudapartFixtureBase,
					bilanEnergetique: {
						consommationEnergetique: undefined,
						emissionDeGaz: undefined,
					},
				},
			);

			const result = convertir.depuisStudapartVersUnJeuneUneSolution(annonceDeLogementStudapart);

			expect(result).to.deep.equal(expected);
		});
	});
});
