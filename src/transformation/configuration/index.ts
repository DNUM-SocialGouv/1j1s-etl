import { Module } from "../../shared/module";
import { createUsecasesContainer } from "./usecase.container";
import { createRepositoriesContainer } from "./repositories.container";
import { createStoringContainer } from "./storing.container";
import { createCronContainer } from "./cron.container";

export function createTransformationModule(): Module {
	const storing = createStoringContainer();
	const repositories = createRepositoriesContainer();
	const usecases = createUsecasesContainer(repositories);
	const crons = createCronContainer();

	return {
		configuration: {},
		crons,
		gateways: {
			repositories,
			storing
		},
		usecases,
	};
}
