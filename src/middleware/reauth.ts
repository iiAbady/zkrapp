import { RequestHandler } from 'express';
import Route from '../structures/Route';

export default function reAuthHandler(file: Route): RequestHandler {
	return async (_, res, next) => {
		if (file.auth && !res.locals.user) {
			return res.redirect(`/login${file.auth === 'admin' ? '/admin' : ''}`);
		} else if (file.auth === 'admin' && !res.locals.user.admin) {
			return res.redirect('/login/admin');
		}
		next();
	};
}
