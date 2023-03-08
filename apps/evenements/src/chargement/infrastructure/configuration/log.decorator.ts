import { ConfigurationFactory } from "@evenements/src/chargement/infrastructure/configuration/configuration";
import {
	EvenementsChargementLoggerStrategy,
} from "@evenements/src/chargement/infrastructure/configuration/logger-strategy";

const configuration = ConfigurationFactory.create();
const loggerStrategy = new EvenementsChargementLoggerStrategy(configuration);

export function CommandLog(flowName: string): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
	return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => Promise<void>>): PropertyDescriptor {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: []): Promise<void> {
			try {
				loggerStrategy.get(flowName).info(`Starting to load [${flowName}] flow`);
				await originalMethod.apply(this, args);
			} catch (e) {
				loggerStrategy.get(flowName).fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
			} finally {
				loggerStrategy.get(flowName).info(`End of loading from [${flowName}] flow`);
			}
		};

		return descriptor;
	};
}
