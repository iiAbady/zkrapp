import { resolve } from 'path';
import { readdir } from 'fs-nextra';
import { Express, RequestHandler } from 'express';
import Database from '../structures/Database';
import logger from '../util/Logger';
import { Logger } from 'winston';
import Route from '../structures/Route';
import { OAuth } from 'oauth';
import { twitter } from '../auth/auth';
import { Connection } from 'typeorm';
import authHandler from '../middleware/auth';
import reautHandler from '../middleware/reauth';


export default class Server {
	public constructor(port: string) {
		this.twitter = twitter;
		this.logger = logger;
		this.port = port;
	}

	public twitter: OAuth;
	public logger: Logger;
	public db!: Connection;
	public port: string;

	public async init(server: Express): Promise<this> {
		// Database
		this.db = Database.get('zkr');
		await this.db.connect();

		// Auth Handler
		server.use(authHandler(this.twitter));

		// Routes
		const ROUTE_DIR = resolve(__dirname, '../routes');
		const routes: string[] = await readdir(ROUTE_DIR);

		for (const route of routes.filter(route => route.endsWith('.js'))) {
			const file: Route = new (require(`${ROUTE_DIR}/${route}`).default)();

			file.db = this.db;
			file.logger = this.logger;
			file.twitter = this.twitter;

			const handler: RequestHandler = (req, res, next): void => file.exec(req, res, next);

			// @ts-ignore
			server[file.method!](file.route!, reautHandler(file), handler);
		}

		server.all('*', (_, res) => res.render('pages/404'));

		server.listen(this.port, () => this.logger.info(`> Server ready at http://localhost:${this.port}`));
		return this;
	}
}
