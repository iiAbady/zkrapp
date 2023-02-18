import { RequestHandler } from 'express';
import { OAuth } from 'oauth';

export default function authHandler(twitter: OAuth): RequestHandler {
	return async (req, res, next) => {
		if (!req.session.token || !req.session.tokenSecert) return next();
		twitter.get(
			'https://api.twitter.com/1.1/account/verify_credentials.json',
			req.session.token,
			req.session.tokenSecert,
			(err, data) => {
				if (err) {
					req.session.destroy(error => {
						if (error) {
							console.error(error);
							next(error);
						} else {
							res.clearCookie('connect.sid');
							console.error(error);
							next(err);
						}
					});
				}
				const { screen_name: username, id_str: id, profile_image_url_https: image } = JSON.parse(data as string);
				res.locals.user = { id, username, image };
				if (id === process.env.OWNER_ID) Object.assign(res.locals.user, { admin: true });
				next();
			},
		);
	};
}
