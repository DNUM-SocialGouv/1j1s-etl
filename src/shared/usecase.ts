export interface Usecase<T> {
	execute(...args: Array<any>): Promise<T>;
}
