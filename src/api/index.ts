import { OAuth } from 'oauth';
import { User } from '../models/Users';
import { join } from 'path';
import * as express from 'express';
import Database from '../structures/Database';
import logger from '../util/Logger';
// import { handleApiError } from '../util/ErrorHandler';
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

	Server
		.set('views', join(__dirname, '..', 'views'))
		.set('view engine', 'ejs')
	    .use(session({
			resave: true,
			saveUninitialized: true,
			secret: session_secret
		}))
		.use(express.static(join(__dirname, '..', '..', 'static')));


	Server.get('/', (_, res) => {
		res.render('pages/index');
	});

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
				res.redirect('/connect');
			} else {
				const usersRepo = db.getRepository(User);
				const user = new User();
				user.token = token;
				user.token_secert = token_secert;
				await usersRepo.save(user);
				res.render('pages/thanks');
			}
		});
	});

	Server.get('*', (_, res) => {
		res.status(404).render('pages/error');
	});

	Server.listen(port, () => {
		logger.info(`> Server ready at http://localhost:${port}`);
	});
}

export { server };


