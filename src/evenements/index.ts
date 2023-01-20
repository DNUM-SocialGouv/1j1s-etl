import { Chargement } from "@evenements/chargement";
import { Extraction } from "@evenements/extraction";
import { Module } from "@shared/configuration/module";
import { Transformation } from "@evenements/transformation";

export const Evenements: Module = {
  Chargement: Chargement.export(),
  Extraction: Extraction.export(),
  Transformation: Transformation.export(),
};
