import { Configuration } from "@configuration/configuration";
import { SousModule } from "@shared/configuration/module";
import yargs from "yargs";

export type Domaine = "events" | "housing" | "internships";
export type Action = "extract" | "transform" | "load";
export type CliCommands = Record<Domaine, Record<Action, SousModule>>
type YargsCommands = { [p: string]: unknown, domain: Domaine, action: Action, flow: string, _: (string | number)[], $0: string };

class CliError extends Error {
	constructor(domain: string, flow: string) {
		super(`Flow ${flow} doesn't exist within ${domain}`);
	}
}

export class CliConfiguration {
	public static create(configuration: Configuration): YargsCommands {
		const domainChoices = configuration.DOMAINS;
		const actionChoices = ["extract", "transform", "load"];

		const flowsByDomain = new Map<string, Array<string>>();
		flowsByDomain.set("events", configuration.EVENTS.FLOWS);
		flowsByDomain.set("housing", configuration.HOUSING.FLOWS);
		flowsByDomain.set("internships", configuration.INTERNSHIPS.FLOWS);

		const flowChoices = [
			...configuration.EVENTS.FLOWS,
			...configuration.HOUSING.FLOWS,
			...configuration.INTERNSHIPS.FLOWS,
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
			flow: {
				alias: "f",
				choices: flowChoices,
				demandOption: true,
				desc: "Tell the CLI which flux you wish to perform the action on",
				string: true,
			},
		};

		return yargs
			.usage("\nUse this CLI to run specific cronjob on application")
			.options(options)
			.help(true)
			.check(({ domain, flow }: { domain?: string, action?: string, flow?: string }) => {
				if (domain && flow && this.isFlowNotWithinDomain(domain, flow, flowsByDomain)) {
					throw new CliError(domain, flow);
				}
				return true;
			})
			.argv as YargsCommands;
	}

	private static isFlowNotWithinDomain(domainToCheck: string, flow: string, flowsByDomain: Map<string, Array<string>>): boolean {
		if (domainToCheck && flow) {
			const flowsForDomain = flowsByDomain.get(domainToCheck);
			return !(flowsForDomain !== undefined && flowsForDomain.includes(flow));
		}
		return false;
	}
}
