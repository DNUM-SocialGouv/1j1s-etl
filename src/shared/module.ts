export type Module = {
	configuration: Record<string, string>;
	crons: Record<string, any>;
	gateways: Record<string, Record<string, any>>;
	usecases: Record<string, any>;
}
