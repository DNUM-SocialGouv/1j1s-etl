import { ConfigurationFactory } from "@maintenance/src/infrastructure/configuration/configuration";

import { LoggerFactory } from "@shared/src/infrastructure/configuration/logger";

const configuration = ConfigurationFactory.create();
const logger = new LoggerFactory(
	configuration.SENTRY.DSN,
	configuration.SENTRY.PROJECT,
	configuration.SENTRY.RELEASE,
	configuration.LOGGER.ENVIRONMENT,
	configuration.LOGGER.CONTEXT,
	configuration.LOGGER.LOG_LEVEL,
	configuration.LOGGER.DOMAINE,
).create({ name: "maintenance" });

export function CommandLog(maintenanceProcessName: string): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
	return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => Promise<void>>): PropertyDescriptor {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: []): Promise<void> {
			try {
				logger.info(`Starting maintenance process [${maintenanceProcessName}]`);
				await originalMethod.apply(this, args);
			} catch (e) {
				logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
			} finally {
				logger.info(`Ending maintenance process [${maintenanceProcessName}]`);
			}
		};

		return descriptor;
	};
}
