export abstract class Controller {
	abstract run(...args: any[]): Promise<any>;
}
