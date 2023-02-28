import { ConfigModule } from "@nestjs/config";
import { TestingModule } from "@nestjs/testing";

import { Client } from "minio";
import { CommandTestFactory } from "nest-commander-testing";

import { expect, StubbedClass, stubClass } from "@test/configuration";

import { CliModule } from "@cli/src/cli.module";

import {
	ChargerFluxTousMobilises,
} from "@evenements/src/chargement/application-service/charger-flux-tous-mobilises.usecase";
import {
	ExtraireFluxEvenementTousMobilises,
} from "@evenements/src/extraction/application-service/extraire-flux-evenement-tous-mobilises.usecase";
import {
	TransformerFluxTousMobilises,
} from "@evenements/src/transformation/application-service/transformer-flux-tous-mobilises.usecase";

import { ChargerFluxImmojeune } from "@logements/src/chargement/application-service/charger-flux-immojeune.usecase";
import { ChargerFluxStudapart } from "@logements/src/chargement/application-service/charger-flux-studapart.usecase";
import { ExtraireImmojeune } from "@logements/src/extraction/application-service/extraire-immojeune.usecase";
import { ExtraireStudapart } from "@logements/src/extraction/application-service/extraire-studapart.usecase";
import {
	TransformerFluxImmojeune,
} from "@logements/src/transformation/application-service/transformer-flux-immojeune.usecase";
import {
	TransformerFluxStudapart,
} from "@logements/src/transformation/application-service/transformer-flux-studapart.usecase";

import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import {
	ChargerFluxStagefrCompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import {
	ChargerFluxStagefrDecompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import { ExtraireJobteaser } from "@stages/src/extraction/application-service/extraire-jobteaser.usecase";
import {
	ExtraireStagefrCompresse,
} from "@stages/src/extraction/application-service/extraire-stagefr-compresse.usecase";
import {
	ExtraireStagefrDecompresse,
} from "@stages/src/extraction/application-service/extraire-stagefr-decompresse.usecase";
import {
	TransformerFluxJobteaser,
} from "@stages/src/transformation/application-service/transformer-flux-jobteaser.usecase";
import {
	TransformerFluxStagefrCompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-compresse.usecase";
import {
	TransformerFluxStagefrDecompresse,
} from "@stages/src/transformation/application-service/transformer-flux-stagefr-decompresse.usecase";

describe("CliModuleTest", () => {
	let cliModule: TestingModule;

	context("Lorsque je lance la commande d'extraction", () => {
		let extraireJobteaser: StubbedClass<ExtraireJobteaser>;
		let extraireStagefrCompresse: StubbedClass<ExtraireStagefrCompresse>;
		let extraireStagefrDecompresse: StubbedClass<ExtraireStagefrDecompresse>;
		let extraireImmojeune: StubbedClass<ExtraireImmojeune>;
		let extraireStudapart: StubbedClass<ExtraireStudapart>;
		let extraireTousMobilises: StubbedClass<ExtraireFluxEvenementTousMobilises>;

		beforeEach(async () => {
			extraireJobteaser = stubClass(ExtraireJobteaser);
			extraireStagefrCompresse = stubClass(ExtraireStagefrCompresse);
			extraireStagefrDecompresse = stubClass(ExtraireStagefrDecompresse);
			extraireImmojeune = stubClass(ExtraireImmojeune);
			extraireStudapart = stubClass(ExtraireStudapart);
			extraireTousMobilises = stubClass(ExtraireFluxEvenementTousMobilises);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: ".env.test" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(ExtraireJobteaser).useValue(extraireJobteaser)
				.overrideProvider(ExtraireStagefrCompresse).useValue(extraireStagefrCompresse)
				.overrideProvider(ExtraireStagefrDecompresse).useValue(extraireStagefrDecompresse)
				.overrideProvider(ExtraireImmojeune).useValue(extraireImmojeune)
				.overrideProvider(ExtraireStudapart).useValue(extraireStudapart)
				.overrideProvider(ExtraireFluxEvenementTousMobilises).useValue(extraireTousMobilises)
				.compile();
		});

		context("du flux Jobteaser", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["extract", "jobteaser"]);

				// Then
				expect(extraireJobteaser.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Stagefr compressé", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["extract", "stagefr-compresse"]);

				// Then
				expect(extraireStagefrCompresse.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Stagefr décompressé", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["extract", "stagefr-decompresse"]);

				// Then
				expect(extraireStagefrDecompresse.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Immojeune", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["extract", "immojeune"]);

				// Then
				expect(extraireImmojeune.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Studapart", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["extract", "studapart"]);

				// Then
				expect(extraireStudapart.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Tous Mobilises", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["extract", "tous-mobilises"]);

				// Then
				expect(extraireTousMobilises.executer).to.have.been.calledOnce;
			});
		});
	});

	context("Lorsque je lance la commande de transformation", () => {
		let transformerJobteaser: StubbedClass<TransformerFluxJobteaser>;
		let transformerStagefrCompresse: StubbedClass<TransformerFluxStagefrCompresse>;
		let transformerStagefrDecompresse: StubbedClass<TransformerFluxStagefrDecompresse>;
		let transformerImmojeune: StubbedClass<TransformerFluxImmojeune>;
		let transformerStudapart: StubbedClass<TransformerFluxStudapart>;
		let transformerTousMobilises: StubbedClass<TransformerFluxTousMobilises>;

		beforeEach(async () => {
			transformerJobteaser = stubClass(TransformerFluxJobteaser);
			transformerStagefrCompresse = stubClass(TransformerFluxStagefrCompresse);
			transformerStagefrDecompresse = stubClass(TransformerFluxStagefrDecompresse);
			transformerImmojeune = stubClass(TransformerFluxImmojeune);
			transformerStudapart = stubClass(TransformerFluxStudapart);
			transformerTousMobilises = stubClass(TransformerFluxTousMobilises);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: ".env.test" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(TransformerFluxJobteaser).useValue(transformerJobteaser)
				.overrideProvider(TransformerFluxStagefrCompresse).useValue(transformerStagefrCompresse)
				.overrideProvider(TransformerFluxStagefrDecompresse).useValue(transformerStagefrDecompresse)
				.overrideProvider(TransformerFluxImmojeune).useValue(transformerImmojeune)
				.overrideProvider(TransformerFluxStudapart).useValue(transformerStudapart)
				.overrideProvider(TransformerFluxTousMobilises).useValue(transformerTousMobilises)
				.compile();
		});

		context("du flux Jobteaser", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["transform", "jobteaser"]);

				// Then
				expect(transformerJobteaser.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Stagefr compressé", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["transform", "stagefr-compresse"]);

				// Then
				expect(transformerStagefrCompresse.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Stagefr décompressé", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["transform", "stagefr-decompresse"]);

				// Then
				expect(transformerStagefrDecompresse.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Immojeune", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["transform", "immojeune"]);

				// Then
				expect(transformerImmojeune.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Studapart", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["transform", "studapart"]);

				// Then
				expect(transformerStudapart.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Tous Mobilises", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["transform", "tous-mobilises"]);

				// Then
				expect(transformerTousMobilises.executer).to.have.been.calledOnce;
			});
		});
	});

	context("Lorsque je lance la commande de chargement", () => {
		let chargerJobteaser: StubbedClass<ChargerFluxJobteaser>;
		let chargerStagefrCompresse: StubbedClass<ChargerFluxStagefrCompresse>;
		let chargerStagefrDecompresse: StubbedClass<ChargerFluxStagefrDecompresse>;
		let chargerImmojeune: StubbedClass<ChargerFluxImmojeune>;
		let chargerStudapart: StubbedClass<ChargerFluxStudapart>;
		let chargerTousMobilises: StubbedClass<ChargerFluxTousMobilises>;

		beforeEach(async () => {
			chargerJobteaser = stubClass(ChargerFluxJobteaser);
			chargerStagefrCompresse = stubClass(ChargerFluxStagefrCompresse);
			chargerStagefrDecompresse = stubClass(ChargerFluxStagefrDecompresse);
			chargerImmojeune = stubClass(ChargerFluxImmojeune);
			chargerStudapart = stubClass(ChargerFluxStudapart);
			chargerTousMobilises = stubClass(ChargerFluxTousMobilises);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: ".env.test" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(ChargerFluxJobteaser).useValue(chargerJobteaser)
				.overrideProvider(ChargerFluxStagefrCompresse).useValue(chargerStagefrCompresse)
				.overrideProvider(ChargerFluxStagefrDecompresse).useValue(chargerStagefrDecompresse)
				.overrideProvider(ChargerFluxImmojeune).useValue(chargerImmojeune)
				.overrideProvider(ChargerFluxStudapart).useValue(chargerStudapart)
				.overrideProvider(ChargerFluxTousMobilises).useValue(chargerTousMobilises)
				.compile();
		});

		context("du flux Jobteaser", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "jobteaser"]);

				// Then
				expect(chargerJobteaser.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Stagefr compressé", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "stagefr-compresse"]);

				// Then
				expect(chargerStagefrCompresse.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Stagefr décompressé", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "stagefr-decompresse"]);

				// Then
				expect(chargerStagefrDecompresse.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Immojeune", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "immojeune"]);

				// Then
				expect(chargerImmojeune.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Studapart", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "studapart"]);

				// Then
				expect(chargerStudapart.executer).to.have.been.calledOnce;
			});
		});

		context("du flux Tous Mobilises", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "tous-mobilises"]);

				// Then
				expect(chargerTousMobilises.executer).to.have.been.calledOnce;
			});
		});
	});
});
