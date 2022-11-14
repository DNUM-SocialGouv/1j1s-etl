import { ConfigurationFactory } from "@stages/transformation/configuration/configuration";
import { LoggerStrategy } from "@stages/transformation/configuration/logger-strategy";

const configuration = ConfigurationFactory.create();
const loggerStrategy = new LoggerStrategy(configuration);

export function TaskLog(flowName: string): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor {
	return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => Promise<void>>): PropertyDescriptor {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: []): Promise<void> {
			try {
				loggerStrategy.get(flowName).info(`Starting to transform [${flowName}] flow`);
				await originalMethod!.apply(this, args);
			} catch (e) {
				loggerStrategy.get(flowName).fatal({ msg: (<Error>e).message, extra: { stack: (<Error>e).stack } });
			} finally {
				loggerStrategy.get(flowName).info("End of transforming from [jobteaser] flow");
			}
		};

		return descriptor;
	};
}
