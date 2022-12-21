import { TransformerFluxStudapartUseCase } from "@logements/transformation/usecase/transformer-flux-studapart.usecase";
import { AnnonceDeLogementRepository } from "@logements/transformation/domain/annonce-de-logement.repository";
import { Studapart } from "@logements/transformation/domain/studapart";
import { expect, StubbedClass, stubClass } from "@test/configuration";
import { StubbedType, stubInterface } from "@salesforce/ts-sinon";
import sinon from "sinon";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@test/logements/transformation/fixture/annonce-de-logement.fixture-builder";
import {
	AnnonceDeLogementStudapartContenuFixtureBuilder,
	AnnonceDeLogementStudapartFixtureBuilder,
} from "@test/logements/transformation/fixture/annonce-de-logement-studapart.fixture-builder";
import { FluxTransformation } from "@logements/transformation/domain/flux";

describe("TransformerFluxStudapartUseCaseTest", () => {
	const fluxTransformation = new FluxTransformation("flux", "history", ".xml", ".xml");
	let repository: StubbedType<AnnonceDeLogementRepository>;
	let convertir: StubbedClass<Studapart.Convertir>;

	let useCase: TransformerFluxStudapartUseCase;

	context("Lorsque je récupérer le flux venant de studapart, je le convertis et le sauvegarde", () => {
		beforeEach(() => {
			repository = stubInterface<AnnonceDeLogementRepository>(sinon);
			repository.recuperer.resolves(AnnonceDeLogementStudapartContenuFixtureBuilder.build(
				[AnnonceDeLogementStudapartFixtureBuilder.build()]
			));
			convertir = stubClass(Studapart.Convertir);
			convertir.depuisStudapartVersUnJeuneUneSolution.withArgs(AnnonceDeLogementStudapartFixtureBuilder.build()).returns(AnnonceDeLogementFixtureBuilder.build());

			useCase = new TransformerFluxStudapartUseCase(repository, convertir);
		});
		
		it("je sauvegarde une liste de logement UnJeuneUneSolution", async () => {
			await useCase.executer(fluxTransformation);

			expect(repository.sauvegarder).to.have.been.calledWith([AnnonceDeLogementFixtureBuilder.build()], fluxTransformation);
		});
	});
});
