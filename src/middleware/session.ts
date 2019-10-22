import * as session from 'express-session';
const memorystore = require('memorystore')(session); // eslint-disable-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports

export default session({
	resave: true,
	saveUninitialized: true,
	secret: process.env.session_secret!,
	cookie: { maxAge: 6048e5, secure: process.env.NODE_ENV === 'production', signed: true },
	store: new memorystore({
		checkPeriod: 6048e5,
	}),
});
