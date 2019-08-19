import { Request, Response } from 'express';
import { Azkar } from '../models/Azkar';
import Route from '../structures/Route';

export default class LogoutRoute extends Route {
	public constructor() {
		super({
			auth: 'admin',
			id: 'dashboard',
			method: 'get',
			route: ['/dashboard']
		});
	}

	public async exec(req: Request, res: Response): Promise<void> {
		const azkar = await this.db!.getRepository(Azkar).find() || [];
		// @ts-ignore
		azkar.sort((a, b) => a.approved - b.approved);
		res.render('pages/dashboard', { rows: azkar });
	}
}
