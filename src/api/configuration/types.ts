import { NextFunction, Request, Response } from "express";

export type HttpMethod = "delete" | "get" | "head" | "options" | "patch" | "post" | "put";

export interface Controller {
	handle(request: Request, response: Response, next: NextFunction): void | Promise<void>;
}

export abstract class Route {
	public readonly controller: Controller;
	public readonly method: HttpMethod;
	public readonly path: string;
	public readonly isActive: boolean;

	constructor(
		controller: Controller,
		method: HttpMethod,
		path: string,
		isActive: boolean,
	) {
		this.controller = controller;
		this.method = method;
		this.path = path;
		this.isActive = isActive;
	}
}
