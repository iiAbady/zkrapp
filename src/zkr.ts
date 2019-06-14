interface TwitError { message: string; statusCode: string; code: string; twitterReply: string; allErrors: Array<TwitError> }

import './util/Env';
import Client from './client/ZkrClient';
import { server } from './api';
import { Logger } from 'winston';

const { consumer_key, consumer_secret, access_token, access_secret } = process.env;
const client = new Client(consumer_key!, consumer_secret!, access_token!, access_secret!);

client.stream('statuses/sample')
	.on('connected', (): Logger => client.logger.info(`[CONNECTED: CLIENT] Zkr App is connected and ready to go!`))
	.on('disconnect', (msg): Logger => client.logger.error(`[DISCONNECTED: CLEINT] ${msg}`))
	.on('warning', (msg): Logger => client.logger.warn(`[WARN: CLIENT] ${msg}`))
	.on('error', (error: TwitError): Logger => client.logger.error(`[ERROR: CLIENT] ${error.message}\nTwitter Reply:${error.twitterReply}`));

process.on('unhandledRejection', (err: any): Logger => client.logger.error(`[UNHANDLED REJECTION] ${err.message}`, err.stack));

server('80');
client.start();
