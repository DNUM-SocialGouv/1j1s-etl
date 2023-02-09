import { ControllersContainer } from "@api/configuration/controllers.container";
import { Route } from "@api/configuration/types";
import { HelloWorldRoute } from "@api/hello-world/hello-world.route";

export class RoutesContainerFactory {
	public static create(controllers: ControllersContainer): Array<Route> {
		return [
			new HelloWorldRoute(controllers.helloWorld, "get", "/hello-world", true),
		];
	}
}
