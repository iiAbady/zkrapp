import { ConnectionManager } from 'typeorm';
import { Azakr } from '../models/Azkar';
import { User } from '../models/Users';
import { Time } from '../models/Time';

const connectionManager = new ConnectionManager();
connectionManager.create({
	name: 'zkr',
	type: 'postgres',
	url: process.env.DB,
	entities: [Azakr, User, Time]
});

export default connectionManager;
