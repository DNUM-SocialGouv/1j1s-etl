import { Application } from "./configuration/application";
import { createApplicationModules } from "./configuration/create-application-modules";
import { configure } from "./configuration/configuration";

function createApplication(): Application {
	const applicationModules = createApplicationModules();
	const configuration = configure();
	return Application.create(configuration, applicationModules);
}

const application = createApplication();
application.start();
