import yargs from "yargs";

type Commands = { [p: string]: unknown, a: string, f: string, _: (string | number)[], $0: string };

export class YargsConfiguration {
	static create(): Commands {
		const actionChoices = ["load"];
		const fluxChoices = ["jobteaser"];

		const options = {
			a: {
				alias: "action",
				choices: actionChoices,
				demandOption: true,
				desc: "Tell the CLI which action you wish to perform",
				string: true,
			},
			f: {
				alias: "flux",
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
