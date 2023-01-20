import { Evenements } from "@evenements/index";
import { Logements } from "@logements/index";
import { Module } from "@shared/configuration/module";
import { Stages } from "@stages/index";

export type Domaine = "events" | "housing" | "internships";
export type Action = "extract" | "transform" | "load";
export type CliCommands = Record<Domaine, Record<Action, Module>>

export class CliFactory {
	public static create(): CliCommands {
		const events = {
			extract: Evenements.ExtractionModule.export(),
			transform: Evenements.TransformationModule.export(),
			load: Evenements.ChargementModule.export(),
		};
		const housing = {
			extract: Logements.ExtractionModule.export(),
			transform: Logements.TransformationModule.export(),
			load: Logements.LoadModule.export(),
		};
		const internships = {
			extract: Stages.ExtractionModule.export(),
			transform: Stages.TransformationModule.export(),
			load: Stages.ChargementModule.export(),
		};
		return {
			events,
			housing,
			internships,
		};
	}
}
