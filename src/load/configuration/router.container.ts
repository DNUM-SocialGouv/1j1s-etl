import { CommonRouter } from "../../shared/route/router";
import { LoadRouter } from "../infrastructure/route";
import { ControllerContainer } from "../infrastructure/controller";

export function createRouters(controllerContainer: ControllerContainer): Array<CommonRouter> {
	return [new LoadRouter(controllerContainer)];
}
