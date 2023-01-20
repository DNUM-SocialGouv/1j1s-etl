import { Chargement } from "@stages/chargement";
import { Extraction } from "@stages/extraction";
import { Module } from "@shared/configuration/module";
import { Transformation } from "@stages/transformation";

export const Stages: Module = {
	Chargement: Chargement.export(),
	Extraction: Extraction.export(),
	Transformation: Transformation.export(),
};
