import * as session from 'express-session';

export default session({
	resave: true,
	saveUninitialized: true,
	secret: process.env.session_secret!,
	cookie: { maxAge: 6048e5, secure: process.env.NODE_ENV === 'production', signed: true }
});
