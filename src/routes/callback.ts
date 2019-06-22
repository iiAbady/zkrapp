
import * as express from 'express';
import logger from '../util/Logger';
import { OAuth } from 'oauth';
import { Repository } from 'typeorm';
import { User } from '../models/Users';

export const register = (app: express.Application, repo: Repository<User>): void => {
	const auth: OAuth = app.locals.twitter;

	app.get('/callback', (req, res) => {
		const { oauth_token, oauth_verifier } = req.query;

		// eslint-disable-next-line promise/prefer-await-to-callbacks
		auth.getOAuthAccessToken(oauth_token, req.session!.tokenSecert, oauth_verifier, async (err, token, token_secert) => {
			if (err) {
				logger.error(`[ERROR: API] ${err.data}`);
				res.redirect('/connect');
			} else {
				const user = new User();
				user.token = token;
				user.token_secert = token_secert;
				await repo.save(user);
				res.render('pages/thanks');
			}
		});
	});
};
