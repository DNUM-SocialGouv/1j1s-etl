import { CliCommands } from "@cli/cli.configuration";
import { Evenements } from "@evenements/index";
import { Logements } from "@logements/index";
import { Stages } from "@stages/index";

export class CliFactory {
	public static create(): CliCommands {
		const events = {
			extract: Evenements.Extraction,
			transform: Evenements.Transformation,
			load: Evenements.Chargement,
		};
		const housing = {
			extract: Logements.Extraction,
			transform: Logements.Transformation,
			load: Logements.Chargement,
		};
		const internships = {
			extract: Stages.Extraction,
			transform: Stages.Transformation,
			load: Stages.Chargement,
		};
		return {
			events,
			housing,
			internships,
		};
	}
}
