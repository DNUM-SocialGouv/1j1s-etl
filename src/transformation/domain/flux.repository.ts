export interface FluxRepository {
	recuperer<T>(url: string): Promise<T>;
}
