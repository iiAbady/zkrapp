import { RequestHandler } from 'express';
import Route from '../structures/Route';

export default function reAuthHandler(file: Route): RequestHandler {
	return async (_, res, next) => {
		if (file.auth && (!res.locals.user || !res.locals.user.admin)) {
			return res.redirect(`/connect`);
		}
		next();
	};
}
