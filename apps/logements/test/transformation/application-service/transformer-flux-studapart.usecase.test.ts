import {
	TransformerFluxStudapart,
} from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";
import { FluxTransformation } from "@logements/src/transformation/domain/model/flux";
import { AnnonceDeLogementRepository } from "@logements/src/transformation/domain/service/annonce-de-logement.repository";
import { Convertir } from "@logements/src/transformation/domain/service/studapart/convertir.domain-service";
import {
	AnnonceDeLogementFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement.fixture-builder";
import {
	AnnonceDeLogementStudapartContenuFixtureBuilder,
	AnnonceDeLogementStudapartFixtureBuilder,
} from "@logements/test/transformation/fixture/annonce-de-logement-studapart.fixture-builder";

import { expect, sinon, StubbedClass, StubbedType, stubClass, stubInterface } from "@shared/test/configuration";

describe("TransformerFluxStudapartUseCaseTest", () => {
	const fluxTransformation = new FluxTransformation("flux", "history", ".xml", ".xml");
	let repository: StubbedType<AnnonceDeLogementRepository>;
	let convertir: StubbedClass<Convertir>;

	let usecase: TransformerFluxStudapart;

	context("Lorsque je récupérer le flux venant de studapart, je le convertis et le sauvegarde", () => {
		beforeEach(() => {
			repository = stubInterface<AnnonceDeLogementRepository>(sinon);
			repository.recuperer.resolves(AnnonceDeLogementStudapartContenuFixtureBuilder.build(
				[AnnonceDeLogementStudapartFixtureBuilder.build()]
			));
			convertir = stubClass(Convertir);
			convertir.depuisStudapartVersUnJeuneUneSolution.withArgs(AnnonceDeLogementStudapartFixtureBuilder.build()).returns(AnnonceDeLogementFixtureBuilder.build());

			usecase = new TransformerFluxStudapart(repository, convertir);
		});

		it("je sauvegarde une liste de logement UnJeuneUneSolution", async () => {
			await usecase.executer(fluxTransformation);

			expect(repository.sauvegarder).to.have.been.calledWith([AnnonceDeLogementFixtureBuilder.build()], fluxTransformation);
		});
	});
});
