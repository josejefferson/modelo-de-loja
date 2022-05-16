function render(page, title, _next = false, folder = 'pages') {
	return (req, res, next) => {
		req.data = req.data || {}
		res.locals.successMsg = req.flash('successMsg')
		res.locals.warningMsg = req.flash('warningMsg')
		res.locals.infoMsg = req.flash('infoMsg')
		res.locals.errorMsg = req.flash('errorMsg')
		res.locals.userData = req.flash('userData')

		res.render(folder + '/' + page, {
			url: req.originalUrl,
			fullURL: req.protocol + '://' + req.get('host') + req.originalUrl,
			_page: page,
			_title: title,
			query: req.query,
			...req.data
		}, (err, html) => {
			if (err) {
				err.ejs = true
				next(err)
			}
			else {
				res.send(html)
				if (_next) next()
			}
		})
	}
}

function renderMsg(title, message) {
	return (req, res, next) => {
		res.render('others/error', {
			url: req.originalUrl,
			fullURL: req.protocol + '://' + req.get('host') + req.originalUrl,
			_page: 'others/error',
			_title: title,
			title,
			message
		})
	}
}

const NUM = '0123456789'
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const ALPHANUM = ALPHA + NUM
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const HEX = 'abcdef' + NUM
const random = {
	NUM,
	ALPHA,
	ALPHANUM,
	ALPHA_UPPER,
	ALPHA_LOWER,
	HEX,
	string: (length = 24, characters = ALPHANUM) => {
		let result = ''
		const charLen = characters.length
		for (let i = 0; i < length; i++)
			result += characters[Math.floor(Math.random() * charLen)]
		return result
	}
}

module.exports = { render, renderMsg, random }