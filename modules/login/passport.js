const bcrypt = require('bcryptjs')
const localStrategy = require('passport-local').Strategy
const Admin = require('mongoose').model('Admins')

module.exports = passport => {
	passport.use(new localStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, async (email, password, done) => {
		const user = await Admin.findOne({ email }).catch(err => {
			done(err, false)
			throw err
		})
		if (!user) return done(null, false, { message: 'Esta conta não existe' })
		if (bcrypt.compareSync(password, user.password)) return done(null, user)
		else return done(null, false, { message: 'Senha incorreta' })
	}))

	passport.serializeUser((user, done) => done(null, user._id))
	passport.deserializeUser(async (id, done) => {
		const user = await Admin.findById(id).catch(err => {
			done(err, false)
			throw err
		})
		done(null, user)
	})
}