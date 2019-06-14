import * as express from 'express';
import { OAuth } from 'oauth';
import Database from '../structures/Database';
import { User } from '../models/Users';
import logger from '../util/Logger';
const session = require('express-session') // eslint-disable-line

const {
	consumer_key,
	consumer_secret,
	callback,
	session_secret
} = process.env;

const oauth = new OAuth(
	'https://twitter.com/oauth/request_token',
	'https://twitter.com/oauth/access_token',
	 consumer_key!,
	 consumer_secret!,
	'1.0A',
	 callback!,
	'HMAC-SHA1'
);

async function server(port: string): Promise<void> {
	const db = Database.get('zkr');
	await db.connect();
	await db.synchronize();

	const Server = express();

	Server.use(session({
		resave: true,
		saveUninitialized: true,
		secret: session_secret
	}));

	Server.get('/connect', (req, res) => {
	// eslint-disable-next-line promise/prefer-await-to-callbacks
		oauth.getOAuthRequestToken((err, token, tokenSecert) => {
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

	Server.get('/callback', (req, res) => {
		const { oauth_token, oauth_verifier } = req.query;
		// @ts-ignore
		// eslint-disable-next-line promise/prefer-await-to-callbacks
		oauth.getOAuthAccessToken(oauth_token, req.session.tokenSecert, oauth_verifier, async (err, token, token_secert) => {
			if (err) {
				logger.error(`[ERROR: API] ${err.data}`);
				res.send('An error occur, Please try again.');
			} else {
				const usersRepo = db.getRepository(User);
				const user = new User();
				user.token = token;
				user.token_secert = token_secert;
				await usersRepo.save(user);
				res.render('Thanks for using our thing.');
			}
		});
	});

	Server.listen(port);
}

export { server };


