import { Module } from "../../shared/module";
import { createUsecasesContainer } from "./usecase.container";
import { createRepositoriesContainer } from "./repositories.container";
import { createStoringContainer } from "./storing.container";
import { createCronsContainer } from "./cron.container";
import { configure } from "../../configuration/configuration";

export function createTransformationModule(): Module {
	const configuration = configure();
	const storing = createStoringContainer();
	const repositories = createRepositoriesContainer();
	const usecases = createUsecasesContainer(repositories);
	const crons = createCronsContainer();

	return {
		configuration,
		crons,
		gateways: {
			repositories,
			storing
		},
		usecases,
	};
}
