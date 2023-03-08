import { CommandRunner, SubCommand } from "nest-commander";

import { Configuration } from "@logements/src/chargement/infrastructure/configuration/configuration";
import { CommandLog } from "@logements/src/chargement/infrastructure/configuration/log.decorator";

import { Usecase } from "@shared/src/application-service/usecase";
import { Flux } from "@shared/src/domain/model/flux";

@SubCommand({
    name: LoadFlowStudapartSubCommand.FLOW_NAME,
})
export class LoadFlowStudapartSubCommand extends CommandRunner {
    private static readonly FLOW_NAME = "studapart";

    constructor(private readonly usecase: Usecase, private readonly configuration: Configuration) {
        super();
    }

    @CommandLog(LoadFlowStudapartSubCommand.FLOW_NAME)
    public async run(): Promise<void> {
        await this.usecase.executer(
            new Flux(
                this.configuration.STUDAPART.NAME,
                this.configuration.STUDAPART.EXTENSION,
            ),
        );
    }
}
