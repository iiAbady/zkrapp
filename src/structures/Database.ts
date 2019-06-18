import { ConnectionManager } from 'typeorm';
import { Azakr } from '../models/Azkar';
import { User } from '../models/Users';

const connectionManager = new ConnectionManager();
connectionManager.create({
	name: 'zkr',
	type: 'postgres',
	url: process.env.DB,
	entities: [Azakr, User]
});

export default connectionManager;
