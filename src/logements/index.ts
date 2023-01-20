import { Chargement } from "@logements/chargement";
import { Extraction } from "@logements/extraction";
import { Module } from "@shared/configuration/module";
import { Transformation } from "@logements/transformation";

export const Logements: Module = {
	Chargement: Chargement.export(),
	Extraction: Extraction.export(),
	Transformation: Transformation.export(),
};
