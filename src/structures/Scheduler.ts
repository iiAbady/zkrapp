import ZkrClient from '../client/ZkrClient';
import { Repository, IsNull, LessThan, MoreThan } from 'typeorm';
import { Azakr } from '../models/Azkar';
import { User } from '../models/Users';

export default class Scheduler {
	protected client: ZkrClient;

	protected repo: Repository<Azakr>;

	protected checkRate: number;

	protected dailyRate: number;

	protected checkInterval!: NodeJS.Timeout;

	public constructor(client: ZkrClient, repository: Repository<Azakr>, { checkRate = Number(process.env.CHECK_RATE), dailyRate = Number(process.env.DAILY_RATE) } = {}) {
		this.client = client;
		this.repo = repository;
		this.checkRate = checkRate;
		this.dailyRate = dailyRate;
	}

	public async run(zkr: Azakr): Promise<void> {
		const usersRepo = this.client.db.getRepository(User);
		const users = await usersRepo.find();

		if (!users.length) {
			return;
		}

		for (const { token, token_secert } of users) {
			try {
				// @ts-ignore
				this.client.setAuth({ access_token: token, access_token_secret: token_secert });
				this.client.tweet(zkr!.content);
			} catch (error) {
				this.client.logger.error(`[SCHEDULER] There was error sending to this user (${token}): `, error);
			}
		}

		this.client.logger.info(`[SCHEDULER] Sent (${zkr.content}) zkr to ${users.length} users.`);
		zkr.last_sent = new Date();
		zkr.sends += 1;
		this.repo.save(zkr);
	}

	public async init(): Promise<void> {
		await this.check();
		this.checkInterval = setInterval(this.check.bind(this), this.checkRate / 2);
	}

	public async check(): Promise<void> {
		// TODO: use a better way for checking
		const check = await this.repo.findOne({ where: { last_sent: MoreThan(new Date(Date.now() - this.checkRate)) } });

		if (check) {
			return;
		}

		const zkr = await this.repo.findOne({
			where: [
				{ last_sent: IsNull(), approved: true },
				/**
				 * @NOTE Posting identical Tweets over multiple hours or days is against Twitter ToS
				 * @NOTE Please make sure that dailyRate is less than a good amount of time that It won't make it look like spammy!
				 * @NOTE Checkout https://help.twitter.com/en/rules-and-policies/twitter-automation
				*/
				{ last_sent: LessThan(new Date(Date.now() - this.dailyRate)) }
			]
		});

		if (!zkr) {
			return;
		}

		this.run(zkr);
	}
}
