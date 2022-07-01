import { Module } from "../shared/module";
import { Configuration } from "./configuration";
import { Server } from "http";

export class Application {
	static INSTANCE: Application | null = null;
	private server: Server;

	private constructor(
		private readonly configuration: Configuration,
		private readonly modules: Module[],
		private readonly logger = console
	) {
	}

	static create(configuration: Configuration, modules: Module[]): Application {
		if (Application.INSTANCE) {
			return Application.INSTANCE;
		}
		const application = new Application(configuration, modules);
		Application.INSTANCE = application;
		return application;
	}

	async start(): Promise<void> {
		this.server.listen()
	}
}
