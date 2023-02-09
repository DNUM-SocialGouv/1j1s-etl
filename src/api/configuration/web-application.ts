import { Route } from "@api/configuration/types";
import express from "express";

export class WebApplication {
	private readonly server: express.Application;
	private readonly routes: Array<Route>;

	private constructor(routes: Array<Route>) {
		this.server = express();
		this.routes = routes;
	}

	public static init(routes: Array<Route>): WebApplication {
		const webApplication = new WebApplication(routes);

		webApplication.gatherApplicationRoutes();

		return webApplication;
	}

	public start(): void {
		this.server.listen(3001, "localhost");
	}

	private gatherApplicationRoutes(): void {
		for (const route of this.routes) {
			if (route.isActive) {
				this.server[route.method](route.path, route.controller.handle.bind(route.controller));
			}
		}
	}
}
