import { CommandRunner, SubCommand } from "nest-commander";

import {
	TransformFlowStudapartTask,
} from "@logements/src/transformation/infrastructure/tasks/transform-flow-studapart.task";

@SubCommand({
	name: "studapart",
})
export class TransformStudapartSubCommand extends CommandRunner {
	constructor(private readonly transformStudapart: TransformFlowStudapartTask) {
		super();
	}

	public override async run(): Promise<void> {
		await this.transformStudapart.run();
	}
}
