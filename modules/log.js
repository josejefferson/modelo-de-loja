const chalk = require('chalk')

module.exports = (prefix, prefixColor = 'blue') => {
	return (content, contentColor = 'yellow') => {
		let text = ''
		if (typeof prefix == 'string') text += chalk[prefixColor](`[${prefix}]`)
		if (typeof content == 'string') {
			text += ' ' + chalk[contentColor](content)
			console.log(text)
		}
		else {
			console.log(text, content)
		}
	}
}