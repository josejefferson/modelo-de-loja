module.exports = (page, title) => {
	return (req, res, next) => {
		req.data = req.data || {}
		res.render('pages/' + page, {
			_page: page,
			_title: title,
			...req.data
		})
		return next()
	}
}