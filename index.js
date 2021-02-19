(async () => {
	console.clear()

	const express = require('express')
	const app = express()
	const bodyParser = require('body-parser')
	const expressLayouts = require('express-ejs-layouts')
	const flash = require('connect-flash')
	const session = require('express-session')
	const passport = require('passport')
	const cookieParser = require('cookie-parser')
	await require('./config/connect')
	require('./config/auth')(passport)

	app.use(session({
		secret: 'aVOkg6yTfi',
		resave: true,
		saveUninitialized: true
	}))
	app.use(passport.initialize())
	app.use(passport.session())
	app.use(flash())
	app.use((req, res, next) => {
		res.locals.success_msg = req.flash('success_msg')
		res.locals.warning_msg = req.flash('warning_msg')
		res.locals.error_msg = req.flash('error_msg')
		res.locals.userData = req.flash('userData')
		res.locals.authUser = req.user || null
		next()
	})

	app.set('view engine', 'ejs')
	app.use(expressLayouts)
	app.set('layout extractScripts', true)
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(cookieParser())
	app.use(express.static('public'))

	app.use('/', require('./helpers/routes'))
	// app.use('/', require('./routes/pages'))
	// app.use('/', require('./routes/actions'))
	// app.use('/admin', /*check.admin,*/ require('./routes/admin-pages'))
	// app.use('/admin', /*check.admin,*/ require('./routes/admin-actions'))

	app.listen(process.env.PORT || 3000, () =>
		console.log('>> [Server] Aberto na porta 3000'))
})()