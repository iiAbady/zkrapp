import { Request, Response } from 'express';
import Route from '../structures/Route';

export default class LogoutRoute extends Route {
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
				this.logger!.error(`Error occur in ${this.route![0]}`, error);
				res.render('pages/error', { code: null });
			} else {
				res.clearCookie('connect.sid');
				res.redirect('/');
			}
		});
	}
}
