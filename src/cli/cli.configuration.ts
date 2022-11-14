import yargs from "yargs";

import { Configuration } from "@configuration/configuration";

type Commands = { [p: string]: unknown, domain: string, action: string, flux: string, _: (string | number)[], $0: string };

export class CliConfiguration {
	public static create(configuration: Configuration): Commands {
		const domainChoices = ["stages", "logements"];
		const actionChoices = ["extract", "transform", "load"];
		const fluxChoices = [
			configuration.JOBTEASER.NAME,
			configuration.STAGEFR_COMPRESSED.NAME,
			configuration.STAGEFR_UNCOMPRESSED.NAME,
		];

		const options = {
			domain: {
				alias: "d",
				choices: domainChoices,
				demandOption: true,
				desc: "Tell the CLI which domain you wish to perform an action on",
				string: true,
			},
			action: {
				alias: "a",
				choices: actionChoices,
				demandOption: true,
				desc: "Tell the CLI which action you wish to perform",
				string: true,
			},
			flux: {
				alias: "f",
				choices: fluxChoices,
				demandOption: true,
				desc: "Tell the CLI which flux you wish to perform the action on",
				string: true,
			},
		};

		return yargs
			.usage("\nUse this CLI to run specific cronjob on application")
			.options(options)
			.help(true)
			.argv as Commands;
	}
}
