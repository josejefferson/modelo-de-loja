module.exports = {
	admin: (req, res, next) => {
		if (req.isAuthenticated() && res.locals.authUser.admin === true) return next()
		req.flash('errorMsg', 'Você não tem permissão para entrar aqui')
		res.redirect(req.query.r || '/')
		// return next()
	}
}