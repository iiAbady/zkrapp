import * as Twitter from 'twit';
import Database from '../structures/Database';
import Scheduler from '../structures/Scheduler';
import logger from '../util/Logger';
import { Connection } from 'typeorm';
import { Time } from '../models/Time';


export default class ZkrClient extends Twitter {
	public logger = logger;

	public db!: Connection;

	public scheduler!: Scheduler;

	public constructor(consumer_key: string, consumer_secret: string, access_token: string, access_token_secret: string) {
		super({
			consumer_key,
			consumer_secret,
			access_token,
			access_token_secret
		});
	}

	public tweet = (content: string) => this.post('statuses/update', { status: `${content}\n\n#ZkrApp\nhttp://zkr.abady.me` });

	public async start(): Promise<void> {
		this.db = Database.get('zkr');
		await this.db.connect();
		this.scheduler = new Scheduler(this, this.db.getRepository(Time));
		this.scheduler.init();
	}
}
