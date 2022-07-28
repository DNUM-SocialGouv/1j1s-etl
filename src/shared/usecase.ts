export interface Usecase {
	executer<T>(...args: Array<object | string | number>): Promise<void | T>;
}
