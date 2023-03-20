import { ConfigurationFactory } from "@gestion-des-contacts/src/infrastructure/configuration/configuration";

import { LoggerFactory } from "@shared/src/infrastructure/configuration/logger";

const configuration = ConfigurationFactory.create();
const logger = new LoggerFactory(
	configuration.SENTRY.DSN,
	configuration.SENTRY.PROJECT,
	configuration.SENTRY.RELEASE,
	configuration.ENVIRONMENT,
	configuration.CONTEXT,
	configuration.LOG_LEVEL,
	configuration.CONTACTS_CEJ.DOMAINE,
).create({ name: "contact-cej" });

export function CommandLog(contactName: string): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
	return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => Promise<void>>): PropertyDescriptor {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: []): Promise<void> {
			try {
				logger.info(`Starting to send contact [${contactName}]`);
				await originalMethod.apply(this, args);
			} catch (e) {
				logger.fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
			} finally {
				logger.info(`Ending to send [${contactName}]`);
			}
		};

		return descriptor;
	};
}
