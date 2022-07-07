export interface Usecase {
	execute<T>(...args: Array<object | string | number>): Promise<T>;
}
