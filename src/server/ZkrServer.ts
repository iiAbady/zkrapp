import { resolve, join } from 'path';
import { Express, RequestHandler } from 'express';
import { readdir } from 'fs-nextra';
import { OAuth } from 'oauth';
import { Connection } from 'typeorm';
import { Logger } from 'winston';
import { twitter } from '../auth/auth';
import authHandler from '../middleware/auth';
import reautHandler from '../middleware/reauth';
import Database from '../structures/Database';
import Route from '../structures/Route';
import logger from '../util/Logger';

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

	public get production(): boolean {
		return process.env.NODE_ENV === 'production';
	}

	public async init(server: Express): Promise<this> {
		// Database
		this.db = Database.get('zkr');
		await this.db.connect();

		// Auth Handler
		server.use(authHandler(this.twitter));

		// API
		const API_DIR = resolve(join(__dirname, '..', 'routes', 'api'));
		const methods: string[] = await readdir(API_DIR);

		for (const method of methods.filter(method => method.endsWith('.js'))) {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const file: Route = new (require(`${API_DIR}/${method}`).default)();

			file.db = this.db;
			file.logger = this.logger;
			file.production = this.production;

			const handler: RequestHandler = async (req, res, next): Promise<void> => {
				try {
					await file.exec(req, res, next);
				} catch (error) {
					res.status(error.code || 500).json({ message: error.message || '' });
				}
			};

			// @ts-expect-error
			server[file.method!](file.route!, handler);
		}

		// Routes
		const ROUTE_DIR = resolve(join(__dirname, '..', 'routes'));
		const routes: string[] = await readdir(ROUTE_DIR);

		for (const route of routes.filter(route => route.endsWith('.js'))) {
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const file: Route = new (require(`${ROUTE_DIR}/${route}`).default)();

			file.db = this.db;
			file.logger = this.logger;
			file.twitter = this.twitter;
			file.production = this.production;

			const handler: RequestHandler = async (req, res, next): Promise<void> => {
				try {
					file.exec(req, res, next);
				} catch (error) {
					if (error.stack && error.code >= 500) this.logger.info(error);

					res.render('pages/error', { code: error.code || 500, message: error.message });
				}
			};
			// @ts-expect-error
			server[file.method!](file.route!, reautHandler(file), handler);
		}

		server.all('*', (_, res) => res.render('pages/404'));

		server.listen(this.port, () => this.logger.info(`> Server ready at http:// localhost:${this.port}`));
		return this;
	}
}
