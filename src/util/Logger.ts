import { createLogger, transports, format } from 'winston';
import * as moment from 'moment';

export default createLogger({
	format: format.combine(
		format.colorize({ level: true }),
		format.timestamp({ format: moment().utcOffset('+03:00').format('YYYY/MM/DD HH:mm:ss') }),
		format.printf((info: any): string => {
			const { timestamp, level, message, ...rest } = info;
			return `[${timestamp}] ${level}: ${message}${Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}` : ''}`;
		})
	),
	transports: [
		new transports.Console({ level: 'info' })
	]
});
