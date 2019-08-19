import { Azkar } from '../../models/Azkar';
import { Request, Response } from 'express';
import Route from '../../structures/Route';

export default class PostAdd extends Route {
	public constructor() {
		super({
			id: 'add',
			method: 'post',
			route: ['/api/add']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		if (!res.locals.user) {
			const errorData = { code: 401, message: 'Unauthorized' };
			throw errorData;
		}

		const data = req.body;
		const azkar = this.db!.getRepository(Azkar);

		const existingZkr = await azkar.findOne({ content: data.content });

		const errorData = { code: 403, message: 'Zkr exists.' };
		if (existingZkr) throw errorData;

		const zkr = new Azkar();
		zkr.content = data.content;
		if (res.locals.admin) zkr.approved = true;
		azkar.save(zkr);

		res.sendStatus(200);
	}
}
