import { Controller, HttpMethod, Route } from "@api/configuration/types";

export class HelloWorldRoute extends Route {
	constructor(
		controller: Controller,
		method: HttpMethod,
		path: string,
		isActive: boolean,
	) {
		super(controller, method, path, isActive);
	}
}
