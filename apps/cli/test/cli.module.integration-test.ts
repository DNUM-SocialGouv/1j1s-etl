import { ConfigModule } from "@nestjs/config";
import { TestingModule } from "@nestjs/testing";

import { Client } from "minio";
import { CommandTestFactory } from "nest-commander-testing";

import { expect, StubbedClass, stubClass } from "@test/library";

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

import {
	ChargerFluxOnisep,
} from "@formations-initiales/src/chargement/application-service/charger-flux-onisep.usecase";

import { EnvoyerLesContactsCejAPoleEmploi } from "@gestion-des-contacts/src/application-service/envoyer-les-contacts-cej-a-pole-emploi.usecase";

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

import {
	PurgerLesAnnoncesDeLogement,
} from "@maintenance/src/application-service/purger-les-annonces-de-logement.usecase";
import { PurgerLesOffresDeStage } from "@maintenance/src/application-service/purger-les-offres-de-stage.usecase";
import { MinioAdminStorageRepository } from "@maintenance/src/infrastructure/gateway/repository/minio-admin-storage.repository";

import { ChargerFluxHellowork } from "@stages/src/chargement/application-service/charger-flux-hellowork.usecase";
import { ChargerFluxJobteaser } from "@stages/src/chargement/application-service/charger-flux-jobteaser.usecase";
import {
	ChargerFluxStagefrCompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-compresse.usecase";
import {
	ChargerFluxStagefrDecompresse,
} from "@stages/src/chargement/application-service/charger-flux-stagefr-decompresse.usecase";
import { ExtraireHellowork } from "@stages/src/extraction/application-service/extraire-hellowork.usecase";
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
		let extraireHellowork: StubbedClass<ExtraireHellowork>;
		let extraireJobteaser: StubbedClass<ExtraireJobteaser>;
		let extraireStagefrCompresse: StubbedClass<ExtraireStagefrCompresse>;
		let extraireStagefrDecompresse: StubbedClass<ExtraireStagefrDecompresse>;
		let extraireImmojeune: StubbedClass<ExtraireImmojeune>;
		let extraireStudapart: StubbedClass<ExtraireStudapart>;
		let extraireTousMobilises: StubbedClass<ExtraireFluxEvenementTousMobilises>;

		beforeEach(async () => {
			extraireHellowork = stubClass(ExtraireHellowork);
			extraireJobteaser = stubClass(ExtraireJobteaser);
			extraireStagefrCompresse = stubClass(ExtraireStagefrCompresse);
			extraireStagefrDecompresse = stubClass(ExtraireStagefrDecompresse);
			extraireImmojeune = stubClass(ExtraireImmojeune);
			extraireStudapart = stubClass(ExtraireStudapart);
			extraireTousMobilises = stubClass(ExtraireFluxEvenementTousMobilises);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(ExtraireHellowork).useValue(extraireHellowork)
				.overrideProvider(ExtraireJobteaser).useValue(extraireJobteaser)
				.overrideProvider(ExtraireStagefrCompresse).useValue(extraireStagefrCompresse)
				.overrideProvider(ExtraireStagefrDecompresse).useValue(extraireStagefrDecompresse)
				.overrideProvider(ExtraireImmojeune).useValue(extraireImmojeune)
				.overrideProvider(ExtraireStudapart).useValue(extraireStudapart)
				.overrideProvider(ExtraireFluxEvenementTousMobilises).useValue(extraireTousMobilises)
				.compile();
		});

		context("du flux Hellowork", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["extract", "hellowork"]);

				// Then
				expect(extraireHellowork.executer).to.have.been.calledOnce;
			});
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
		let chargerHellowork: StubbedClass<ChargerFluxHellowork>;
		let chargerJobteaser: StubbedClass<ChargerFluxJobteaser>;
		let chargerStagefrCompresse: StubbedClass<ChargerFluxStagefrCompresse>;
		let chargerStagefrDecompresse: StubbedClass<ChargerFluxStagefrDecompresse>;
		let chargerImmojeune: StubbedClass<ChargerFluxImmojeune>;
		let chargerStudapart: StubbedClass<ChargerFluxStudapart>;
		let chargerTousMobilises: StubbedClass<ChargerFluxTousMobilises>;
		let chargerOnisep: StubbedClass<ChargerFluxOnisep>;

		beforeEach(async () => {
			chargerHellowork = stubClass(ChargerFluxHellowork);
			chargerJobteaser = stubClass(ChargerFluxJobteaser);
			chargerStagefrCompresse = stubClass(ChargerFluxStagefrCompresse);
			chargerStagefrDecompresse = stubClass(ChargerFluxStagefrDecompresse);
			chargerImmojeune = stubClass(ChargerFluxImmojeune);
			chargerStudapart = stubClass(ChargerFluxStudapart);
			chargerTousMobilises = stubClass(ChargerFluxTousMobilises);
			chargerOnisep = stubClass(ChargerFluxOnisep);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: ".env.test" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(ChargerFluxOnisep).useValue(chargerOnisep)
				.overrideProvider(ChargerFluxHellowork).useValue(chargerHellowork)
				.overrideProvider(ChargerFluxJobteaser).useValue(chargerJobteaser)
				.overrideProvider(ChargerFluxStagefrCompresse).useValue(chargerStagefrCompresse)
				.overrideProvider(ChargerFluxStagefrDecompresse).useValue(chargerStagefrDecompresse)
				.overrideProvider(ChargerFluxImmojeune).useValue(chargerImmojeune)
				.overrideProvider(ChargerFluxStudapart).useValue(chargerStudapart)
				.overrideProvider(ChargerFluxTousMobilises).useValue(chargerTousMobilises)
				.compile();
		});

		context("du flux Onisep", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "onisep"]);

				// Then
				expect(chargerOnisep.executer).to.have.been.calledOnce;
			});
		});
		
		context("du flux Hellowork", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["load", "hellowork"]);
				
				// Then
				expect(chargerHellowork.executer).to.have.been.calledOnce;
			});
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

	context("Lorsque je lance la commande de maintenance", () => {
		let purgerLesOffresDeStage: StubbedClass<PurgerLesOffresDeStage>;
		let purgerLesAnnoncesDeLogement: StubbedClass<PurgerLesAnnoncesDeLogement>;

		beforeEach(async () => {
			purgerLesOffresDeStage = stubClass(PurgerLesOffresDeStage);
			purgerLesAnnoncesDeLogement = stubClass(PurgerLesAnnoncesDeLogement);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: ".env.test" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(PurgerLesOffresDeStage).useValue(purgerLesOffresDeStage)
				.overrideProvider(PurgerLesAnnoncesDeLogement).useValue(purgerLesAnnoncesDeLogement)
				.compile();
		});

		context("qui purge les offres de stage", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["maintain", "purge-internships"]);

				// Then
				expect(purgerLesOffresDeStage.executer).to.have.been.calledOnce;
			});
		});

		context("qui purge les annonces de logement", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["maintain", "purge-housing-ads"]);

				// Then
				expect(purgerLesAnnoncesDeLogement.executer).to.have.been.calledOnce;
			});
		});
	});

	context("Lorsque je lance la commande d'envoi de contact", () => {
		let envoyerLesContactsCejAPoleEmploi: StubbedClass<EnvoyerLesContactsCejAPoleEmploi>;

		beforeEach(async () => {
			envoyerLesContactsCejAPoleEmploi = stubClass(EnvoyerLesContactsCejAPoleEmploi);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: ".env.test" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(EnvoyerLesContactsCejAPoleEmploi).useValue(envoyerLesContactsCejAPoleEmploi)
				.compile();
		});

		context("qui envoie les contacts CEJ à Pôle Emploi", () => {
			it("execute la commande", async () => {
				// When
				await CommandTestFactory.run(cliModule, ["send-contacts", "cej"]);

				// Then
				expect(envoyerLesContactsCejAPoleEmploi.executer).to.have.been.calledOnce;
			});
		});
	});

	context("Lorsque je lance la commande de création du bucket", () => {
		let minioAdminStorageClient: StubbedClass<MinioAdminStorageRepository>;

		beforeEach(async () => {
			minioAdminStorageClient = stubClass(MinioAdminStorageRepository);

			cliModule = await CommandTestFactory.createTestingCommand({
				imports: [CliModule, ConfigModule.forRoot({ envFilePath: ".env.test" })],
			})
				.overrideProvider(Client).useValue(stubClass(Client))
				.overrideProvider(MinioAdminStorageRepository).useValue(minioAdminStorageClient)
				.compile();
		});

		context("et que je ne spécifie que le nom du bucket", () => {
			it("crée le bucket et la règle de cycle de vie par défaut", async () => {
				// Given
				const bucketName = "some-bucket";
				const defaultDaysAfterExpiration = Number(process.env["MINIO_DAYS_AFTER_EXPIRATION"]);

				// When
				await CommandTestFactory.run(cliModule, ["mkbucket", "-b", bucketName]);

				// Then
				const expectedLifecycleRule = {
					Rule: [{
						ID: bucketName,
						Status: "Enabled",
						Expiration: { Days: defaultDaysAfterExpiration },
						RuleFilter: { Prefix: "" },
					}],
				};
				expect(minioAdminStorageClient.createBucket).to.have.been.calledOnce;
				expect(minioAdminStorageClient.setBucketLifecycle).to.have.been.calledOnceWith(bucketName, expectedLifecycleRule);
			});
		});

		context("et que je spécifie à la fois le nom du bucket et le nombre de jours après expiration", () => {
			context("et que ce nombre est une durée positive", () => {
				it("crée le bucket et la règle de cycle de vie avec le nombre de jours après expiration souhaité  en valeur absolue", async () => {
					// Given
					const bucketName = "some-bucket";
					const daysAfterExpiration = 30;

					// When
					await CommandTestFactory.run(cliModule, ["mkbucket", "-b", bucketName, "-e", daysAfterExpiration.toString()]);

					// Then
					const expectedLifecycleRule = {
						Rule: [{
							ID: bucketName,
							Status: "Enabled",
							Expiration: { Days: daysAfterExpiration },
							RuleFilter: { Prefix: "" },
						}],
					};
					expect(minioAdminStorageClient.createBucket).to.have.been.calledOnce;
					expect(minioAdminStorageClient.setBucketLifecycle).to.have.been.calledOnceWith(bucketName, expectedLifecycleRule);
				});
			});

			context("et que ce nombre est une durée négative", () => {
				it("crée le bucket et la règle de cycle de vie avec le nombre de jours après expiration souhaité en valeur absolue", async () => {
					// Given
					const bucketName = "some-bucket";
					const daysAfterExpiration = -30;

					// When
					await CommandTestFactory.run(cliModule, ["mkbucket", "-b", bucketName, "-e", daysAfterExpiration.toString()]);

					// Then
					const expectedLifecycleRule = {
						Rule: [{
							ID: bucketName,
							Status: "Enabled",
							Expiration: { Days: -daysAfterExpiration },
							RuleFilter: { Prefix: "" },
						}],
					};
					expect(minioAdminStorageClient.createBucket).to.have.been.calledOnce;
					expect(minioAdminStorageClient.setBucketLifecycle).to.have.been.calledOnceWith(bucketName, expectedLifecycleRule);
				});
			});
		});
	});
});
