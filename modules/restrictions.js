module.exports = {
	admin: (req, res, next) => {
		if (req.isAuthenticated() && req.authUser.admin === true) return next()
		req.flash('error_msg', 'Você não tem permissão para entrar aqui')
		res.redirect(req.query.r || '/')
		// return next()
	}
}