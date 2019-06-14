import ZkrClient from '../client/ZkrClient';
import { LessThan, Repository } from 'typeorm';
import { Time } from '../models/Time';
import { Azakr } from '../models/Azkar';
import { User } from '../models/Users';

export default class Scheduler {
	protected client: ZkrClient;

	protected repo: Repository<any>;

	protected checkRate: number;

	protected checkInterval!: NodeJS.Timeout;

	public constructor(client: ZkrClient, repository: Repository<any>, { checkRate = Number(process.env.CHECK_RATE) } = {}) {
		this.client = client;
		this.repo = repository;
		this.checkRate = checkRate;
	}

	public async run(): Promise<void> {
		const azkarRepo = this.client.db.getRepository(Azakr);
		const zkr = await azkarRepo.findOne({ approved: true, lastSended: LessThan(new Date(Date.now() - Number(process.env.DAILY_RATE))) });
		if (!zkr) return;
		const usersRepo = this.client.db.getRepository(User);
		const users = await usersRepo.find();
		for (const { token, token_secert } of users) {
			// @ts-ignore
			this.client.setAuth({ access_token: token, access_token_secret: token_secert });
			this.client.tweet(zkr!.content);
		}
		this.client.logger.info(`[SCHEDULER] Sent (${zkr.lastSended}) zkr to ${users.length} users.`);
		zkr!.lastSended = new Date();
		azkarRepo.save(zkr!);
	}

	public async init(): Promise<void> {
		await this.check();
		this.checkInterval = setInterval(this.check.bind(this), this.checkRate);
	}

	public async check(): Promise<void> {
		const timeRepo = this.client.db.getRepository(Time);
		const time = await timeRepo.find({ triggers_at: LessThan(new Date(Date.now() - this.checkRate)) });
		if (!time) return;
		this.run();
	}
}
