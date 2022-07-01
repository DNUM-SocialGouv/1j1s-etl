import { CommonRouter } from "./route/router";

export type Module = {
	configuration: Record<string, string>;
	controllers: Record<string, any>;
	cron: Record<string, any>;
	gateways: Record<string, Record<string, any>>;
	routers: Array<CommonRouter>;
	usecases: Record<string, any>;
}
