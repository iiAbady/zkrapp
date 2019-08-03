import { Request, Response } from 'express';
import Route from '../structures/Route';

export default class IndexRoute extends Route {
	public constructor() {
		super({
			id: 'index',
			method: 'get',
			route: ['/']
		});
	}

	public exec(req: Request, res: Response): void {
		res.render('pages/index');
	}
}
