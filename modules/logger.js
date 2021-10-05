const { createLogger, format, transports } = require('winston')
const chalk = require('chalk')
const PrettyError = require('pretty-error')
const prettyError = new PrettyError()
prettyError.appendStyle({
	'pretty-error > header > title > kind': { display: 'none' },
	'pretty-error > header > colon': { display: 'none' },
	'pretty-error > header > message': { display: 'none' },
	'pretty-error > trace > item': { margin: 0 }
})

const LEVEL_COLORS = {
	crit: 'magenta',
	error: 'red',
	warn: 'yellow',
	fail: 'red',
	succ: 'green',
	info: 'cyan',
	http: 'green',
	debug: 'white'
}

const logger = createLogger({
	levels: {
		crit: 0,
		error: 1,
		warn: 2,
		fail: 3,
		succ: 4,
		info: 5,
		http: 6,
		debug: 7
	},
	level: 'debug',
	format: format.combine(
		format.errors({ stack: true }),
		format.timestamp()
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.timestamp({ format: 'hh:mm:ss' }),
				format.printf((log) => {
					const levelColor = LEVEL_COLORS[log.level] || 'white'
					const timestamp = chalk.gray(log.timestamp)
					const level = chalk[levelColor](log.level.toUpperCase())
					const mod = log.mod ? chalk.underline(log.mod) + ': ' : ''
					const message = chalk.keyword(levelColor)(log.message)
					const errorStack = log.stack ? `${prettyError.render(log)}` : ''
					return `${timestamp} ${level} ${mod}${message}${errorStack}`
				})
			)
		}),
		new transports.File({
			filename: 'logs.log',
			format: format.combine(
				format.json(),
				format.errors({ stack: true })
			)
		})
	]
})

module.exports = (mod) => {
	return logger.child({ mod })
}