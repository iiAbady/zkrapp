import { Request, Response } from 'express';
import Route from '../structures/Route';

export default class IndexRoute extends Route {
	public constructor() {
		super({
			id: 'connect',
			method: 'get',
			route: ['/connect']
		});
	}

	public exec(req: Request, res: Response): void {
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		this.twitter!.getOAuthRequestToken((err, request_token, request_tokenSecert) => {
			if (err) {
		  this.logger!.error(`[ERROR: API] ${err.data}`);
		  res.render('pages/error', { code: err.statusCode });
			} else {
		  req.session!.request_tokenSecert = request_tokenSecert;
		  res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${request_token}`);
	  }
		});
	}
}
