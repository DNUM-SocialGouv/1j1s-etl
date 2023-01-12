import { Rule } from "eslint";
import { ImportDeclaration } from "estree";
import { NoOnionArchitectureViolation } from "../no-onion-architecture-violation";
import { expect, sinon, StubbedType, stubInterface } from "./configuration";

const message = "Onion architecture violation";
let ruleContext: StubbedType<Rule.RuleContext>;
let node: StubbedType<ImportDeclaration & Rule.NodeParentExtension>;

describe("NoOnionArchitectureViolation", () => {
	beforeEach(() => {
		ruleContext = stubInterface<Rule.RuleContext>(sinon);
		node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
	});

	describe("Lorsque le fichier courant appartient au métier", () => {
		describe("et qu'il est dans le dossier domain", () => {
			beforeEach(() => {
				ruleContext.getPhysicalFilename.returns("../root/domain/path/to/some/file.ts");
			});

			describe("et que l'import concerne un import en provenance du dossier infrastructure", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "root/infrastructure/path/to/some/file.ts";

					// When
					NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			describe("et que l'import concerne un import en provenance du dossier usecase", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "root/usecase/path/to/some/file.ts";

					// When
					NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});
		});

		describe("et qu'il est dans le dossier usecase", () => {
			beforeEach(() => {
				ruleContext.getPhysicalFilename.returns("../root/usecase/path/to/some/file.ts");
			});

			describe("et que l'import concerne un import en provenance du dossier infrastructure", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "root/infrastructure/path/to/some/file.ts";

					// When
					NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			describe("et que l'import concerne un import en provenance du dossier domain", () => {
				it("ne fait rien", () => {
					// Given
					node.source.value = "root/domain/path/to/some/file.ts";

					// When
					NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});

			describe("et que l'import concerne un import en provenance du dossier usecase", () => {
				it("ne fait rien", () => {
					// Given
					node.source.value = "root/usecase/path/to/some/file.ts";

					// When
					NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});
		});
	});

	describe("Lorsque le fichier courant appartient à l'infrastructure", () => {
		beforeEach(() => {
			ruleContext.getPhysicalFilename.returns("root/infrastructure/path/to/file.ts");
		});

		describe("et que l'import provient du dossier domain", () => {
			it("ne fait rien", () => {
				// Given
				node.source.value = "root/domain/path/to/some/file.ts";

				// When
				NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		describe("et que l'import provient du dossier configuration", () => {
			it("ne fait rien", () => {
				// Given
				node.source.value = "root/configuration/path/to/some/file.ts";

				// When
				NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		describe("et que l'import provient du dossier usecase", () => {
			it("reporte l'anomalie", () => {
				// Given
				node.source.value = "root/usecase/path/to/some/file.ts";

				// When
				NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
			});
		});
	});

	describe("Lorsque le fichier courant appartient à la configuration", () => {
		beforeEach(() => {
			ruleContext.getPhysicalFilename.returns("root/configuration/path/to/file.ts");
		});

		describe("et que l'import provient du dossier domain", () => {
			it("ne fait rien", () => {
				// Given
				node.source.value = "root/domain/path/to/some/file.ts";

				// When
				NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		describe("et que l'import provient du dossier infrastructure", () => {
			it("ne fait rien", () => {
				// Given
				node.source.value = "root/infrastructure/path/to/some/file.ts";

				// When
				NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		describe("et que l'import provient du dossier usecase", () => {
			it("ne fait rien", () => {
				// Given
				node.source.value = "root/usecase/path/to/some/file.ts";

				// When
				NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});
	});

	describe("Lorsque le fichier courant appartient aux tests", () => {
		it("ne fait rien", () => {
			// Given
			ruleContext.getPhysicalFilename.returns("root/test/domain/path/to/file.ts");
			node.source.value = "root/configuration/path/to/some/file.ts";

			// When
			NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(ruleContext, node);

			// Then
			expect(ruleContext.report).to.not.have.been.called;
		});
	});
});
