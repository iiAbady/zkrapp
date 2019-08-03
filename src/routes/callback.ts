import { Request, Response } from 'express';
import { User } from '../models/Users';
import Route from '../structures/Route';

export default class IndexRoute extends Route {
	public constructor() {
		super({
			id: 'callback',
			method: 'get',
			route: ['/callback']
		});
	}

	public exec(req: Request, res: Response): void {
		const { oauth_token, oauth_verifier } = req.query;

		// eslint-disable-next-line promise/prefer-await-to-callbacks
		this.twitter!.getOAuthAccessToken(oauth_token, req.session!.tokenSecert, oauth_verifier, async (err, token, tokenSecert) => {
			if (err) {
				this.logger!.error(`[ERROR] ${err.data}`);
				res.redirect('/connect');
			} else {
				const user = new User();
				user.token = token;
				user.token_secert = tokenSecert;
				await this.db!.getRepository(User).save(user);
				// delete uneeded value.
				delete req.session!.request_tokenSecert;
				req.session!.token = token;
				req.session!.tokenSecert = tokenSecert;
				res.render('pages/thanks');
			}
		});
	  }
}
