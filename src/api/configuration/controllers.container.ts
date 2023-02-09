import { HelloWorldController } from "@api/hello-world/hello-world.controller";

export type ControllersContainer = {
	helloWorld: HelloWorldController;
}

export class ControllersContainerFactory {
	public static create(): ControllersContainer {
		return {
			helloWorld: new HelloWorldController(),
		};
	}
}
