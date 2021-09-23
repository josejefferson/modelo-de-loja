const prettyError = require('pretty-error').start()
prettyError.appendStyle({
	'pretty-error > header > title > kind': {
		display: 'none'
	},

	'pretty-error > header > colon': {
		display: 'none'
	},

	'pretty-error > header > message': {
		background: 'red',
	},

	'pretty-error > trace > item': {
		margin: 0,
	},

	'pretty-error > trace > item > footer > addr': {
		// display: 'none'
	}
})

module.exports = prettyError