import { ConfigurationFactory } from "@logements/src/extraction/infrastructure/configuration/configuration";
import {
	LogementsExtractionLoggerStrategy,
} from "@logements/src/extraction/infrastructure/configuration/logger.strategy";

const configuration = ConfigurationFactory.create();
const loggerStrategy = new LogementsExtractionLoggerStrategy(configuration);

export function CommandLog(flowName: string): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
	return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => Promise<void>>): PropertyDescriptor {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: []): Promise<void> {
			try {
				loggerStrategy.get(flowName).info(`Starting to extract [${flowName}] flow`);
				await originalMethod.apply(this, args);
			} catch (e) {
				loggerStrategy.get(flowName).fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
			} finally {
				loggerStrategy.get(flowName).info(`End of extracting from [${flowName}] flow`);
			}
		};

		return descriptor;
	};
}
