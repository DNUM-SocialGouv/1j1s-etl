import { StubbedType } from "@salesforce/ts-sinon";
import { Rule } from "eslint";
import { ImportDeclaration } from "estree";
import { NoCrossSubContextImport } from "../no-cross-sub-context-import";
import { expect, sinon, stubInterface } from "./configuration";

const message = "Forbidden cross-subcontext import";
let ruleContext: StubbedType<Rule.RuleContext>;
let node: StubbedType<ImportDeclaration & Rule.NodeParentExtension>;

describe("NoCrossSubContextImport", () => {
	describe("Lorsque le fichier courant n'appartient pas aux sous-contextes identifiés", () => {
		it("ne fait rien", () => {
			// Given
			ruleContext = stubInterface<Rule.RuleContext>(sinon);
			ruleContext.getPhysicalFilename.returns("@shared/path/to/some/file.ts");
			node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
			node.source.value = "import { Something } from \"root/directory/to/chargement/path/to/some/other/file.ts\"";

			// When
			NoCrossSubContextImport.checkNoCrossSubContext(ruleContext, node);

			// Then
			expect(ruleContext.report).to.not.have.been.called;
		});
	});

	describe("Lorsque le fichier courant appartient aux sous-contextes identifiés", () => {
		describe("et que l'import provient du même sous-contexte", () => {
			it("ne fait rien", () => {
				// Given
				ruleContext = stubInterface<Rule.RuleContext>(sinon);
				ruleContext.getPhysicalFilename.returns("root/directory/chargement/path/to/some/file.ts");
				node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
				node.source.value = "import { Something } from \"@logements/chargement/path/to/some/other/file.ts\"";

				// When
				NoCrossSubContextImport.checkNoCrossSubContext(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		describe("et que l'import provient d'un autre sous-contexte", () => {
			it("reporte l'anomalie", () => {
				// Given
				ruleContext = stubInterface<Rule.RuleContext>(sinon);
				ruleContext.getPhysicalFilename.returns("root/directory/chargement/path/to/some/file.ts");
				node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
				node.source.value = "import { Something } from \"@logements/extraction/path/to/some/file.ts\"";

				// When
				NoCrossSubContextImport.checkNoCrossSubContext(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
			});
		});
	});
});
