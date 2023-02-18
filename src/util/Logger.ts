import * as moment from 'moment-timezone';
import { createLogger, transports, format } from 'winston';

const time = (): string =>
	moment()
		.tz('Asia/Riyadh')
		.format('MM/DD HH:mm:ss');

export default createLogger({
	format: format.combine(
		// @ts-expect-error
		format.timestamp({ format: time }),
		format.colorize({ level: true }),
		format.printf((info: any): string => {
			const { timestamp, level, message, ...rest } = info;
			return `[${timestamp}] ${level}: ${message}${
				Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}` : ''
			}`;
		}),
	),
	transports: [new transports.Console({ level: 'info' })],
});
