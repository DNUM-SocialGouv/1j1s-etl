import { Controller } from "@api/configuration/types";
import { NextFunction, Request, Response } from "express";

export class HelloWorldController implements Controller {
	public handle(request: Request, response: Response, next: NextFunction): void {
		response.status(200).json({ "msg": "Hello World !" }).end();
		next();
	}
}
