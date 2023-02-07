import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/transformation/fixture/annonce-de-logement.fixture-builder";
import { AnnonceDeLogementRepository } from "@logements/transformation/domain/service/annonce-de-logement.repository";
import {
	AnnonceDeLogementStudapartContenuFixtureBuilder,
	AnnonceDeLogementStudapartFixtureBuilder,
} from "@test/logements/transformation/fixture/annonce-de-logement-studapart.fixture-builder";
import { Convertir } from "@logements/transformation/domain/service/studapart/convertir.domain-service";
import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@test/configuration";
import { FluxTransformation } from "@logements/transformation/domain/model/flux";
import {
	TransformerFluxStudapartUseCase,
} from "@logements/transformation/application-service/transformer-flux-studapart.usecase";

describe("TransformerFluxStudapartUseCaseTest", () => {
	const fluxTransformation = new FluxTransformation("flux", "history", ".xml", ".xml");
	let repository: StubbedType<AnnonceDeLogementRepository>;
	let convertir: StubbedClass<Convertir>;

	let useCase: TransformerFluxStudapartUseCase;

	context("Lorsque je récupérer le flux venant de studapart, je le convertis et le sauvegarde", () => {
		beforeEach(() => {
			repository = stubInterface<AnnonceDeLogementRepository>(sinon);
			repository.recuperer.resolves(AnnonceDeLogementStudapartContenuFixtureBuilder.build(
				[AnnonceDeLogementStudapartFixtureBuilder.build()]
			));
			convertir = stubClass(Convertir);
			convertir.depuisStudapartVersUnJeuneUneSolution.withArgs(AnnonceDeLogementStudapartFixtureBuilder.build()).returns(AnnonceDeLogementFixtureBuilder.build());

			useCase = new TransformerFluxStudapartUseCase(repository, convertir);
		});

		it("je sauvegarde une liste de logement UnJeuneUneSolution", async () => {
			await useCase.executer(fluxTransformation);

			expect(repository.sauvegarder).to.have.been.calledWith([AnnonceDeLogementFixtureBuilder.build()], fluxTransformation);
		});
	});
});