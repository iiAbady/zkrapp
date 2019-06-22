import { join } from 'path';
import { User } from '../models/Users';
import * as express from 'express';
import Database from '../structures/Database';
import logger from '../util/Logger';
import * as auth from '../middleware/auth';
import * as routes from '../routes';

async function server(port: string): Promise<void> {
	const db = Database.get('zkr');
	await db.connect();
	await db.synchronize();

	const Server = express();

	Server
		.set('views', join(__dirname, '..', 'views'))
		.set('view engine', 'ejs')
		.use(express.static(join(__dirname, '..', '..', 'static')));

	auth.register(Server);
	routes.register(Server, db.getRepository(User));

	Server.listen(port, () => {
		logger.info(`> Server ready at http://localhost:${port}`);
	});
}

export { server };


