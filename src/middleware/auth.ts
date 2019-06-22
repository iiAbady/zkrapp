import { OAuth } from 'oauth';
import * as session from 'express-session';

export const register = (app: any): void => {
	const {
		consumer_key,
		consumer_secret,
		callback,
		session_secret
	} = process.env;

	const twitter = new OAuth(
		'https://twitter.com/oauth/request_token',
		'https://twitter.com/oauth/access_token',
	    consumer_key!,
	    consumer_secret!,
		'1.0A',
	    callback!,
		'HMAC-SHA1'
	);

	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: session_secret!
	}));

	app.locals.twitter = twitter;
};
