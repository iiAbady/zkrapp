import * as express from 'express';
import logger from '../util/Logger';
import { OAuth } from 'oauth';

export const register = (app: express.Application): void => {
	const auth: OAuth = app.locals.twitter;

	app.get('/connect', (req, res) => {
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		auth.getOAuthRequestToken((err, token, tokenSecert) => {
			if (err) {
		  logger.error(`[ERROR: API] ${err.data}`);
		  res.send('An error occur, Please try again.');
			} else {
				// @ts-ignore
	      req.session.tokenSecert = tokenSecert;
		  res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${token}`);
	  }
		});
	});
};
