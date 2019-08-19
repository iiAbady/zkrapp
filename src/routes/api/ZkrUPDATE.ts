import { Azkar } from '../../models/Azkar';
import { Request, Response } from 'express';
import Route from '../../structures/Route';

export default class PutUpdate extends Route {
	public constructor() {
		super({
			id: 'update',
			method: 'put',
			route: ['/api/update']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		if (!res.locals.user || !res.locals.user.admin) {
			const errorData = { code: 401, message: 'Unauthorized' };
			throw errorData;
		}

		const data = req.body;
		if (!['approve', 'unapprove', 'delete'].includes(data.action)) {
			const errorData = { code: 401, message: 'You must include an action.' };
			throw errorData;
		}

		const azkar = this.db!.getRepository(Azkar);

		const zkr = await azkar.findOne({ id: data.id });

		const errorData = { code: 401, message: "Zkr doesn't exists." };
		if (!zkr) throw errorData;

		if (data.action === 'delete') {
			azkar.remove(zkr);
		} else {
			zkr.approved = data.action === 'approve' ? true : false;
			azkar.save(zkr);
		}

		res.sendStatus(200);
	}
}
