import { Request, Response } from 'express';
import Route from '../structures/Route';

export default class IndexRoute extends Route {
	public constructor() {
		super({
			auth: true,
			id: 'logout',
			method: 'get',
			route: ['/logout']
		});
	}

	public exec(req: Request, res: Response): void {
		req.session!.destroy(error => {
			if (error) {
				console.error(error);
			} else {
				res.clearCookie('connect.sid');
				res.redirect(req.headers.referer || '/');
			}
		});
	}
}
