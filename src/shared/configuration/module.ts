import { Task } from "@shared/infrastructure/task/task";

export type SousModule = Record<string, Task>;
export type Module = Record<SousModule.Nom, SousModule>;

export namespace SousModule {
	export type Nom = "Extraction" | "Transformation" | "Chargement";
}
