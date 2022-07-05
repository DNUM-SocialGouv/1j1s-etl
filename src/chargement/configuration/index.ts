import { Module } from "../../shared/module";
import { createUsecasesContainer } from "./usecase.container";
import { createRepositoriesContainer } from "./repositories.container";
import { createStoringContainer } from "./storing.container";
import { createCronsContainer } from "./cron.container";
import { configure } from "../../configuration/configuration";

export function createChargementModule(): Module {
	const configuration = configure();
	const storing = createStoringContainer(configuration);
	const repositories = createRepositoriesContainer();
	const usecases = createUsecasesContainer(repositories);
	const crons = createCronsContainer(usecases);

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
