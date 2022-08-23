export interface Usecase {
	executer<T>(...args: Array<object | string | number>): void | T | Promise<T | void>;
}
