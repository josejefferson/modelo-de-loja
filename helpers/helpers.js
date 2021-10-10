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
		res.render('others/objNotFound', {
			url: req.originalUrl,
			fullURL: req.protocol + '://' + req.get('host') + req.originalUrl,
			_page: 'others/objNotFound',
			_title: title,
			title,
			message
		})
	}
}

module.exports = { render, renderMsg }