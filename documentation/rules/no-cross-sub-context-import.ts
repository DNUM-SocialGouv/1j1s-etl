import { ImportDeclaration } from "estree";
import { Rule } from "eslint";

export class NoCrossSubContextImport {
	private static subcontexts = ["extraction", "transformation", "chargement"];
	private static message = "Forbidden cross-subcontext import";

	public static create(context: Rule.RuleContext): Rule.RuleListener {
		return {
			ImportDeclaration: (node: ImportDeclaration & Rule.NodeParentExtension): void => {
				NoCrossSubContextImport.checkNoCrossSubContext(context, node);
			}
		}
	}

	public static checkNoCrossSubContext(context: Rule.RuleContext, node: ImportDeclaration & Rule.NodeParentExtension): void {
		const currentFileSubcontext = this.getSubcontext(context.getPhysicalFilename());
		const currentImportSubcontext = this.getSubcontext(<string>node.source.value);

		if(this.importIsFromAnotherContextThanFileOne(currentFileSubcontext, currentImportSubcontext)) {
			context.report({ node, message: this.message });
		}
	}

	private static getSubcontext(currentString: string): string {
		for (const subcontext of this.subcontexts) {
			if (currentString.match(subcontext)) {
				return subcontext;
			}
		}
		return "";
	}

	private static importIsFromAnotherContextThanFileOne(currentFileSubcontext: string, currentImportSubcontext: string): boolean {
		return (this.subcontexts.includes(currentFileSubcontext) && this.subcontexts.includes(currentImportSubcontext) && currentImportSubcontext !== currentFileSubcontext);
	}
}
