import { Request, Response } from 'express';
import Route from '../structures/Route';

export default class ConnectRoute extends Route {
	public constructor() {
		super({
			id: 'connect',
			method: 'get',
			route: ['/connect'],
		});
	}

	public exec(req: Request, res: Response): void {
		this.twitter!.getOAuthRequestToken((err, request_token, request_tokenSecert) => {
			if (err) {
				this.logger!.error(`[ERROR] ${err.data}`);
				const errorData = { code: 400, message: err.data };
				throw errorData;
			} else {
				req.session!.request_tokenSecert = request_tokenSecert;
				res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${request_token}`);
			}
		});
	}
}
