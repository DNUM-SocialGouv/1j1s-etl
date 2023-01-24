import { Rule } from "eslint";
import { ImportDeclaration } from "estree";

export class NoOnionArchitectureViolation {
	private static domainAndBoundariesDirectories = ["domain", "usecase"];
	private static technicalDirectories = ["configuration", "infrastructure"];
	private static directoriesToCheck = [...this.domainAndBoundariesDirectories, ...this.technicalDirectories];
	private static message = "Onion architecture violation";

	public static create(context: Rule.RuleContext): Rule.RuleListener {
		return {
			ImportDeclaration: (node: ImportDeclaration & Rule.NodeParentExtension): void => {
				NoOnionArchitectureViolation.checkNoTechnicalImportIntoDomain(context, node);
			},
		};
	}

	public static checkNoTechnicalImportIntoDomain(context: Rule.RuleContext, node: ImportDeclaration & Rule.NodeParentExtension) {
		const currentFilePath = context.getPhysicalFilename();

		if (currentFilePath.match("test") || currentFilePath.match("task") || currentFilePath.match("container")) {
			return;
		}

		const filePathDirectory = this.getDirectory(currentFilePath);
		const importDirectory = this.getDirectory(<string>node.source.value);

		switch (filePathDirectory) {
			case "domain":
				if(this.technicalDirectories.includes(importDirectory) || importDirectory === "usecase") {
					context.report({ node, message: this.message });
				}
				break;
			case "usecase":
				if(this.technicalDirectories.includes(importDirectory)) {
					context.report({ node, message: this.message });
				}
				break;
			case "infrastructure":
				if(importDirectory === "usecase") {
					context.report({ node, message: this.message });
				}
				break;
			default:
				break;
		}
	}

	private static getDirectory(path: string): string {
		for (const directory of this.directoriesToCheck) {
			if (path.match(directory)) {
				return directory;
			}
		}

		return "";
	}
}
