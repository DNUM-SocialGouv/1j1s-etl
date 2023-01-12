import { ImportDeclaration } from "estree";
import { Rule } from "eslint";

type FileAndImportNodeContext = {
	importModuleName: string
	fileModuleName: string,
	isImportFromContextModules: boolean
	isImportFromTechnicalModules: boolean
}

export class NoCrossContextImport {
	private static contextModules = ["@evenements", "@logements", "@stages"];
	private static technicalModules = ["@cli", "@configuration", "@test"];
	private static modules = [...this.contextModules, ...this.technicalModules];

	public static create(context: Rule.RuleContext): Rule.RuleListener {
		return {
			ImportDeclaration(node): void {
				NoCrossContextImport.checkNoCrossContext(context, node);
			},
		};
	}

	public static checkNoCrossContext(context: Rule.RuleContext, node: ImportDeclaration & Rule.NodeParentExtension): void {
		const currentImportModuleName = this.getCurrentImportModuleName(<string>node.source.value, this.modules);

		if (this.isWithinApplicationImport(currentImportModuleName)) {
			const currentContext: FileAndImportNodeContext = {
				importModuleName: currentImportModuleName,
				fileModuleName: this.extractCurrentFileModuleName(context.getPhysicalFilename()),
				isImportFromContextModules: this.contextModules.includes(currentImportModuleName),
				isImportFromTechnicalModules: this.technicalModules.includes(currentImportModuleName),
			};
			let isError = false;

			switch (currentContext.fileModuleName) {
				case "@shared":
					isError = this.shallAllowImportForSharedModule(currentContext);
					break;
				case "@evenements":
				case "@logements":
				case "@stages":
					isError = this.shallAllowImportForDomainModule(currentContext);
					break;
				case "@configuration":
					isError = this.shallAllowImportForConfigurationModule(currentContext);
					break;
				default:
					break;
			}

			if (isError) context.report({ node, message: "Forbidden cross-context import" });
		}
	}

	private static extractCurrentFileModuleName(currentFilePath: string): string {
		const regex = new RegExp(/src\/[a-zA-Z]*\//);
		const currentFilePathWithSrc = regex.exec(currentFilePath);
		let currentFileModuleName: string = "";

		if (currentFilePathWithSrc !== null && currentFilePathWithSrc.length > 0) {
			currentFileModuleName = "@".concat(currentFilePathWithSrc[0].split("/")[1]);
		}

		return currentFileModuleName;
	}

	private static isWithinApplicationImport(currentImportModuleName: string): boolean {
		return this.modules.includes(currentImportModuleName);
	}

	private static getCurrentImportModuleName(currentString: string, modules: Array<string>): string {
		for (const module of modules) {
			if (currentString.match(module)) {
				return module;
			}
		}

		return "";
	}

	private static shallAllowImportForSharedModule(currentContext: FileAndImportNodeContext): boolean {
		return (currentContext.isImportFromContextModules || currentContext.isImportFromTechnicalModules);
	}

	private static shallAllowImportForDomainModule(context: FileAndImportNodeContext): boolean {
		return this.isDifferentDomainModule(context) || this.isUnallowedTechnicalModule(context);
	}

	private static shallAllowImportForConfigurationModule(context: FileAndImportNodeContext): boolean {
		return ((context.isImportFromTechnicalModules && context.importModuleName !== context.fileModuleName) || context.isImportFromContextModules);
	}

	private static isDifferentDomainModule(context: FileAndImportNodeContext): boolean {
		return context.isImportFromContextModules && context.importModuleName !== context.fileModuleName;
	}

	private static isUnallowedTechnicalModule(context: FileAndImportNodeContext): boolean {
		return context.isImportFromTechnicalModules && context.importModuleName !== "@configuration";
	}
}
