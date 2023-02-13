import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement.fixture-builder";
import {
	AnnonceDeLogementImmojeuneFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement-immojeune.fixture-builder";
import { AnnonceDeLogementRepository } from "@logements/src/transformation/domain/service/annonce-de-logement.repository";
import { AssainisseurDeTexte } from "@shared/src/assainisseur-de-texte";
import { Convertir } from "@logements/src/transformation/domain/service/immojeune/convertir.domain-service";
import { DateService } from "@shared/src/date.service";
import { expect, sinon, StubbedType, stubClass, stubInterface } from "@test/configuration";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";
import { Immojeune } from "@logements/src/transformation/domain/model/immojeune";
import { TransformerFluxImmojeune } from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import { UnJeune1Solution } from "@logements/src/transformation/domain/model/1jeune1solution";

const dateEcriture = new Date("2022-01-01T00:00:00.000Z");
let repository: StubbedType<AnnonceDeLogementRepository>;
let assainisseurDeTexte: StubbedType<AssainisseurDeTexte>;
let usecase: TransformerFluxImmojeune;
let flux: FluxTransformation;
let dateService: StubbedType<DateService>;

describe("TransformerFluxImmojeuneTest", () => {
	beforeEach(() => {
		repository = stubInterface(sinon);
		assainisseurDeTexte = stubInterface(sinon);
		dateService = stubClass(DateService);
		dateService.maintenant.returns(dateEcriture);
		dateService.toIsoDateFromFrenchFormatWithSeconds.restore();
		usecase = new TransformerFluxImmojeune(repository, new Convertir(assainisseurDeTexte, dateService));
		flux = new FluxTransformation("flux", "old", ".json", ".json");
	});

	context("Lorsque je transforme le flux en provenance d'immojeune", () => {
		it("je récupère le contenu du flux stocké sur le répertoire distant", async () => {
			repository.recuperer.resolves([AnnonceDeLogementImmojeuneFixtureBuilder.build()]);

			await usecase.executer(flux);

			expect(repository.recuperer).to.have.been.calledOnceWith(new FluxTransformation("flux", "old", ".json", ".json"));
		});

		it("je sauvegarde le contenu du flux transformé sur le répertoire distant", async () => {
			assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
			assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");

			repository.recuperer.resolves([
				AnnonceDeLogementImmojeuneFixtureBuilder.build(),
			]);

			flux = new FluxTransformation("flux", "old", ".json", ".json");

			await usecase.executer(flux);

			expect(repository.sauvegarder).to.have.been.calledWith(
				[AnnonceDeLogementFixtureBuilder.build()],
				new FluxTransformation("flux", "old", ".json", ".json"),
			);
		});

		context("Et que le titre et la description contiennent des balises html", () => {
			it("retourne le titre et la description avec des balises markdown", async () => {
				assainisseurDeTexte.nettoyer.withArgs("<h1>Le titre de l'annonce</h1>").returns("Le titre de l'annonce\n===========================");
				assainisseurDeTexte.nettoyer.withArgs("<p>La description de l'annonce</p>").returns("\"\n\n\nLa description de l'annonce\n\n");
				repository.recuperer.resolves([
					AnnonceDeLogementImmojeuneFixtureBuilder.build({
						title: "<h1>Le titre de l'annonce</h1>",
						description: "<p>La description de l'annonce</p>",
					}),
				]);

				await usecase.executer(flux);

				expect(repository.sauvegarder).to.have.been.calledWith([
					AnnonceDeLogementFixtureBuilder.build({
						titre: "Le titre de l'annonce\n===========================",
						description: "\"\n\n\nLa description de l'annonce\n\n",
					}),
				], new FluxTransformation("flux", "old", ".json", ".json"));
			});
		});

		context("Et que le type de logement est inconnu", () => {
			it("retourne le type non renseigné", async () => {
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");
				repository.recuperer.resolves([
					AnnonceDeLogementImmojeuneFixtureBuilder.build({
						type: "chateau" as Immojeune.TypeDeLogement,
					}),
				]);

				await usecase.executer(flux);

				expect(repository.sauvegarder).to.have.been.calledWith([
					AnnonceDeLogementFixtureBuilder.build({
						type: "non renseigné" as UnJeune1Solution.Type,
					}),
				], new FluxTransformation("flux", "old", ".json", ".json"));
			});
		});

		context("Et que le type de bien est inconnu", () => {
			it("retourne le type non renseigné", async () => {
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");
				repository.recuperer.resolves([
					AnnonceDeLogementImmojeuneFixtureBuilder.build({
						property_type: "grange" as Immojeune.TypeDeBien,
					}),
				]);

				await usecase.executer(flux);

				expect(repository.sauvegarder).to.have.been.calledWith([
					AnnonceDeLogementFixtureBuilder.build({
						typeBien: "non renseigné" as UnJeune1Solution.TypeBien,
					}),
				], new FluxTransformation("flux", "old", ".json", ".json"));
			});
		});

		context("Et que les services inclus sont cleaningTools et un non référencé", () => {
			it("retourne lun tableau de services inclus avec ['nécessaire de nettoyage', 'non renseigné']", async () => {
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");
				repository.recuperer.resolves([
					AnnonceDeLogementImmojeuneFixtureBuilder.build({
						includedServices: [
							Immojeune.ServiceInclus.CLEANING_TOOLS,
							"sauna" as Immojeune.ServiceInclus,
						],
					}),
				]);

				await usecase.executer(flux);

				expect(repository.sauvegarder).to.have.been.calledWith([
					AnnonceDeLogementFixtureBuilder.build({
						servicesInclus: [
							{ nom: UnJeune1Solution.ServiceInclus.Nom.NECESSAIRE_DE_NETTOYAGE },
							{ nom: UnJeune1Solution.ServiceInclus.Nom.NON_RENSEIGNE },
						],
					}),
				], new FluxTransformation("flux", "old", ".json", ".json"));
			});
		});

		context("Et que la date de disponibilité n'est pas renseigné", () => {
			it("retourne la date du jour au format attendu", async () => {
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");

				const resultatTransformation = [AnnonceDeLogementImmojeuneFixtureBuilder.build()];
				delete resultatTransformation[0].availableAt;

				repository.recuperer.resolves(resultatTransformation);

				await usecase.executer(flux);

				expect(repository.sauvegarder.getCall(0).args).to.have.deep.members([[
					AnnonceDeLogementFixtureBuilder.build({
						dateDeDisponibilite: "2022-01-01T00:00:00.000Z",
					}),
				], new FluxTransformation("flux", "old", ".json", ".json")]);
			});
		});

		context("Et que la sourceCreatedAt n'est pas renseigné", () => {
			it("retourne la date du jour au format attendu", async () => {
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");

				const resultatTransformation = [AnnonceDeLogementImmojeuneFixtureBuilder.build()];
				delete resultatTransformation[0].date_creation;

				repository.recuperer.resolves(resultatTransformation);

				await usecase.executer(flux);

				expect(repository.sauvegarder.getCall(0).args).to.have.deep.members([[
					AnnonceDeLogementFixtureBuilder.build({
						sourceCreatedAt: "2022-01-01T00:00:00.000Z",
					}),
				], new FluxTransformation("flux", "old", ".json", ".json")]);
			});
		});

		context("Et que la sourceUpdatedAt n'est pas renseigné", () => {
			it("retourne la date du jour au format attendu", async () => {
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");

				const resultatTransformation = [AnnonceDeLogementImmojeuneFixtureBuilder.build()];
				delete resultatTransformation[0].date_update;

				repository.recuperer.resolves(resultatTransformation);

				await usecase.executer(flux);

				expect(repository.sauvegarder.getCall(0).args).to.have.deep.members([[
					AnnonceDeLogementFixtureBuilder.build({
						sourceUpdatedAt: "2022-01-01T00:00:00.000Z",
					}),
				], new FluxTransformation("flux", "old", ".json", ".json")]);
			});
		});

		context("Et que la consommation énergétique est UNDEFINED dans le flux d'origine", () => {
			it("retourne undefined", async () => {
				const resultatTransformation = [AnnonceDeLogementImmojeuneFixtureBuilder.build({ energyConsumption: "UNDEFINED" })];
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");
				repository.recuperer.resolves(resultatTransformation);

				await usecase.executer(flux);

				expect(repository.sauvegarder.getCall(0).args).to.have.deep.members([
					[AnnonceDeLogementFixtureBuilder.build({ bilanEnergetique: { consommationEnergetique: undefined, emissionDeGaz: "B" } })],
					new FluxTransformation("flux", "old", ".json", ".json"),
				]);
			});
		});

		context("Et que l'émission carbone est UNDEFINED dans le flux d'origine", () => {
			it("retourne undefined", async () => {
				const resultatTransformation = [AnnonceDeLogementImmojeuneFixtureBuilder.build({ greenhouseGasesEmission: "UNDEFINED" })];
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");
				repository.recuperer.resolves(resultatTransformation);

				await usecase.executer(flux);

				expect(repository.sauvegarder.getCall(0).args).to.have.deep.members([
					[AnnonceDeLogementFixtureBuilder.build({ bilanEnergetique: { consommationEnergetique: "2.21GW", emissionDeGaz: undefined } })],
					new FluxTransformation("flux", "old", ".json", ".json"),
				]);
			});
		});

		context("Et que le format de la date de création est au format français", () => {
			it("retourne la date au format ISO 8601", async () => {
				const resultatTransformation = [AnnonceDeLogementImmojeuneFixtureBuilder.build({ date_creation: "01/01/2022 10:00:00" })];
				assainisseurDeTexte.nettoyer.withArgs("La description de l'annonce").returns("La description de l'annonce");
				assainisseurDeTexte.nettoyer.withArgs("Le titre de l'annonce").returns("Le titre de l'annonce");
				repository.recuperer.resolves(resultatTransformation);

				await usecase.executer(flux);

				expect(repository.sauvegarder.getCall(0).args).to.have.deep.members([
					[AnnonceDeLogementFixtureBuilder.build({ sourceCreatedAt: "2022-01-01T09:00:00.000Z" })],
					new FluxTransformation("flux", "old", ".json", ".json"),
				]);
			});
		});
	});
});
