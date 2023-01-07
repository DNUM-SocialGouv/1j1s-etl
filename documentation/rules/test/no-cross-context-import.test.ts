import { Rule } from "eslint";
import { ImportDeclaration } from "estree";
import { NoCrossContextImportRule } from "../no-cross-context-import";
import { expect, sinon, StubbedType, stubInterface } from "./configuration";

const message = "Forbidden cross-context import";
let ruleContext: StubbedType<Rule.RuleContext>;
let node: StubbedType<ImportDeclaration & Rule.NodeParentExtension>;

describe("NoCrossContextImport", () => {
	beforeEach(() => {
		ruleContext = stubInterface<Rule.RuleContext>(sinon);
		node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
	});

	context("Lorsque l'import ne concerne pas un module de l'application", () => {
		it("ne fait rien", () => {
			// Given
			ruleContext.getPhysicalFilename.returns("./path/to/src/shared/some/file.ts");
			node.source.value = "import { SomeClass } from \"@somepackage/some/file.ts";

			// When
			NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

			// Then
			expect(ruleContext.report).to.not.have.been.called;
		});
	});

	context("Lorsque l'import concerne un module de l'application", () => {
		context("et que je me trouve dans le module 'shared'", () => {
			beforeEach(() => {
				ruleContext.getPhysicalFilename.returns("./path/to/src/shared/some/file.ts");
			});

			context("si mon import est un module métier", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@stages/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			context("si mon import est un module technique", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@cli/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			context("si mon import provient du même module", () => {
				it("ne fait rien", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@shared/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});
		});

		context("et que je me trouve dans le module 'evenements'", () => {
			beforeEach(() => {
				ruleContext.getPhysicalFilename.returns("./path/to/src/evenements/some/file.ts");
			});

			context("si mon import provient du même module", () => {
				it("ne fait rien", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@evenements/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});

			context("si mon import provient d'un autre module métier", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@logements/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			context("si mon import provient d'un module technique", () => {
				context("qui n'est pas 'configuration'", () => {
					it("reporte l'anomalie", () => {
						// Given
						node.source.value = "import { SomeClass } from \"@cli/some/other/file\"";

						// When
						NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

						// Then
						expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
					});
				});

				context("qui est 'configuration'", () => {
					it("ne fait rien", () => {
						// Given
						node.source.value = "import { SomeClass } from \"@configuration/some/other/file\"";

						// When
						NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

						// Then
						expect(ruleContext.report).to.not.have.been.called;
					});
				});
			});
		});

		context("et que je me trouve dans le module 'logements'", () => {
			beforeEach(() => {
				ruleContext.getPhysicalFilename.returns("./path/to/src/logements/some/file.ts");
			});

			context("si mon import provient du même module", () => {
				it("ne fait rien", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@logements/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});

			context("si mon import provient d'un autre module métier", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@stages/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			context("si mon import provient d'un module technique", () => {
				context("qui n'est pas 'configuration'", () => {
					it("reporte l'anomalie", () => {
						// Given
						node.source.value = "import { SomeClass } from \"@cli/some/other/file\"";

						// When
						NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

						// Then
						expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
					});
				});

				context("qui est 'configuration'", () => {
					it("ne fait rien", () => {
						// Given
						node.source.value = "import { SomeClass } from \"@configuration/some/other/file\"";

						// When
						NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

						// Then
						expect(ruleContext.report).to.not.have.been.called;
					});
				});
			});
		});

		context("et que je me trouve dans le module 'stages'", () => {
			beforeEach(() => {
				ruleContext.getPhysicalFilename.returns("./path/to/src/stages/some/file.ts");
			});

			context("si mon import provient du même module", () => {
				it("ne fait rien", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@stages/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});

			context("si mon import provient d'un autre module métier", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@evenements/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			context("si mon import provient d'un module technique", () => {
				context("qui n'est pas 'configuration'", () => {
					it("reporte l'anomalie", () => {
						// Given
						node.source.value = "import { SomeClass } from \"@cli/some/other/file\"";

						// When
						NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

						// Then
						expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
					});
				});

				context("qui est 'configuration'", () => {
					it("ne fait rien", () => {
						// Given
						node.source.value = "import { SomeClass } from \"@configuration/some/other/file\"";

						// When
						NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

						// Then
						expect(ruleContext.report).to.not.have.been.called;
					});
				});
			});
		});

		context("et que je me trouve dans le module 'cli'", () => {
			it("ne fait rien", () => {
				// Given
				ruleContext.getPhysicalFilename.returns("./path/to/src/cli/some/file.ts");
				node.source.value = "import { SomeClass } from \"@stages/some/other/file\"";

				// When
				NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("et que je me trouve dans le module 'configuration'", () => {
			beforeEach(() => {
				ruleContext.getPhysicalFilename.returns("./path/to/src/configuration/some/file.ts");
			});

			context("si mon import provient d'un module métier", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@stages/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			context("si mon import provient d'un autre module technique", () => {
				it("reporte l'anomalie", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@cli/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
				});
			});

			context("si mon import provient du même module", () => {
				it("ne fait rien", () => {
					// Given
					node.source.value = "import { SomeClass } from \"@configuration/some/other/file\"";

					// When
					NoCrossContextImportRule.checkNoCrossContext(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});
		});
	});
});
