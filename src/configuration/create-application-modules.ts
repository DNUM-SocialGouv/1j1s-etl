import { Module } from "../shared/module";
import { createTransformationModule } from "../transformation/configuration";

export function createApplicationModules(): Array<Module> {
	return [
		createTransformationModule()
	];
}
