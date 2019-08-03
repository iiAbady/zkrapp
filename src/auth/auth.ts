import { OAuth } from 'oauth';

const {
	consumer_key,
	consumer_secret,
	callback
} = process.env;

export const twitter = new OAuth(
	'https://twitter.com/oauth/request_token',
	'https://twitter.com/oauth/access_token',
	    consumer_key!,
	    consumer_secret!,
	'1.0A',
	    callback!,
	'HMAC-SHA1'
);
