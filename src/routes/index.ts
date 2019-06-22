import * as express from 'express';
import * as connect from './connect';
import * as callback from './callback';
import { Repository } from 'typeorm';
import { User } from '../models/Users';

export const register = (app: express.Application, repo: Repository<User>): void => {
	app.get('/', (_, res) => {
		res.render('pages/index');
	});

	connect.register(app);
	callback.register(app, repo);

	app.get('*', (_, res) => {
		res.status(404).render('pages/error');
	});
};
