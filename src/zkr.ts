interface TwitError { message: string; statusCode: string; code: string; twitterReply: string; allErrors: Array<TwitError> }

import './util/Env';
import { Logger } from 'winston';
import { join } from 'path';
import * as express from 'express';
import session from './middleware/session';
import Client from './client/ZkrClient';
import Server from './server/ZkrServer';


const app = express();

const { consumer_key, consumer_secret, access_token, access_secret, PORT } = process.env;
const client = new Client(consumer_key!, consumer_secret!, access_token!, access_secret!);
const server = new Server(PORT!);

client.stream('statuses/sample')
	.on('connected', (): Logger => client.logger.info(`[CONNECTED: CLIENT] Zkr App is connected and ready to go!`))
	.on('disconnect', (msg): Logger => client.logger.error(`[DISCONNECTED: CLEINT] ${msg}`))
	.on('warning', (msg): Logger => client.logger.warn(`[WARN: CLIENT] ${msg}`))
	.on('error', (error: TwitError): Logger => client.logger.error(`[ERROR: CLIENT] ${error.message}\nTwitter Reply:${error.twitterReply}`));

app
	.set('views', join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.use(express.static(join(__dirname, '..', 'static')))
	.use(session);

server.init(app);
client.start();

process.on('unhandledRejection', (err: any): Logger => client.logger.error(`[UNHANDLED REJECTION] ${err.message}`, err.stack));
