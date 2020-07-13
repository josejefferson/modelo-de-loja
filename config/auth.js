const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports = function (passport) {
	passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, senha, done) => {
		const user = await User.findOne({ where: { email: email } }).catch(err => {
			done(err, false)
			throw err
		})
		if (!user) {
			return done(null, false, {message: 'Esta conta não existe'})
		}

		if (bcrypt.compareSync(senha, user.password)) {
			return done(null, user)
		} else {
			return done(null, false, {message: 'Senha incorreta'})
		}
	}))

	passport.serializeUser((user, done) => {
		done(null, user.id)
	})

	passport.deserializeUser(async (id, done) => {
		const user = await User.findByPk(id).catch(err => { done(err, false); throw err})
		done(null, user)
	})
}