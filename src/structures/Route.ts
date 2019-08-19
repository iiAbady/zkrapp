import { NextFunction, Request, Response } from 'express';
import { OAuth } from 'oauth';
import { Logger } from 'winston';
import { Connection } from 'typeorm';

interface IRouteOptions {
	auth?: boolean | 'admin';
	id?: string;
	method?: string;
	route?: string[];
	twitter?: OAuth;
	logger?: Logger;
	db?: Connection;
	production?: boolean;
}

export default class Route {
	public constructor(options?: IRouteOptions) {
	  this.auth = options!.auth;

	  this.id = options!.id;

	  this.method = options!.method;

	  this.route = options!.route;

	  this.twitter = options!.twitter;

	  this.logger = null;

	  this.db = null;

	  this.production = false;
	}

	public auth?: boolean | 'admin';
	public id?: string;
	public method?: string;
	public route?: string[];
	public twitter?: OAuth;
	public logger?: Logger | null;
	public db?: Connection | null;
	public production?: boolean;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public exec(req: Request, res: Response, next?: NextFunction): void {
	  throw new Error('You cannot invoke this base class method.');
	}
}
