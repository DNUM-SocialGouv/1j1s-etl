import { Module } from "../../shared/module";
import { createControllerContainer } from "./controller.container";
import { createRouters } from "./router.container";
import { createUsecasesContainer } from "./usecase.container";
import { createRepositoriesContainer } from "./repositories.container";
import { createStoringContainer } from "./storing.container";

export function createTransformationModule(): Module {
	const storing = createStoringContainer();
	const repositories = createRepositoriesContainer();
	const usecases = createUsecasesContainer(repositories);
	const controllers = createControllerContainer(usecases);
	const routers = createRouters(controllers);

	return {
		configuration: {},
		controllers,
		cron: {},
		gateways: {
			repositories,
			storing
		},
		routers,
		usecases,
	};
}
