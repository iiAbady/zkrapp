import { ConnectionManager } from 'typeorm';
import { Azkar } from '../models/Azkar';
import { User } from '../models/Users';

const connectionManager = new ConnectionManager();
connectionManager.create({
	name: 'zkr',
	type: 'postgres',
	url: process.env.DB,
	entities: [Azkar, User],
});

export default connectionManager;
