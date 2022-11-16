import { Logger } from "@shared/configuration/logger";

export interface LoggerStrategy {
	get(flowName: string): Logger;
}
