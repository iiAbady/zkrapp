import { Request, Response } from 'express';
import { User } from '../models/Users';
import Route from '../structures/Route';

export default class CallbackRoute extends Route {
	public constructor() {
		super({
			id: 'callback',
			method: 'get',
			route: ['/callback'],
		});
	}

	public exec(req: Request, res: Response): void {
		const { oauth_token, oauth_verifier } = req.query;

		this.twitter!.getOAuthAccessToken(
			oauth_token as string,
			req.session.tokenSecert,
			oauth_verifier as string,
			async (err: any, token: string, tokenSecert: string) => {
				if (err) {
					this.logger!.error(`[ERROR] ${err.data}`);
					res.redirect('/connect');
				} else {
					const user = new User();
					user.token = token;
					user.token_secert = tokenSecert;
					await this.db!.getRepository(User).save(user);
					// delete uneeded value.
					delete req.session.request_tokenSecert;
					req.session.token = token;
					req.session.tokenSecert = tokenSecert;
					req.flash('loginInfo', 'شكراً {user}, سيتم نشر ذكر لك كل ساعة من الان.');
					res.redirect('/');
				}
			},
		);
	}
}
