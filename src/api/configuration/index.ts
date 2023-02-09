import { ControllersContainerFactory } from "@api/configuration/controllers.container";
import { RoutesContainerFactory } from "@api/configuration/routes.container";
import { WebApplication } from "@api/configuration/web-application";

export class WebApplicationFactory {
	public static create(): WebApplication {
		const controllers = ControllersContainerFactory.create();
		const routes = RoutesContainerFactory.create(controllers);

		return WebApplication.init(routes);
	}
}
