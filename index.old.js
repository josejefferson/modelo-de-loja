(async () => {
	console.clear()

	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const io = require('socket.io')(http)
	const bodyParser = require('body-parser')
	const expressLayouts = require('express-ejs-layouts')
	const flash = require('connect-flash')
	const session = require('express-session')
	const passport = require('passport')
	const cookieParser = require('cookie-parser')
	await require('./config/connect')
	require('./config/auth')(passport)
	require('./helpers/sockets')(io)

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
	app.use(express.static('src'))
	app.use('/', require('./helpers/routes')(io))
	app.use((err, req, res, next) => {
		console.log(err)
		req.flash('error_msg', 'Ocorreu um erro interno do servidor')
		res.redirect('/')
	})

	const PORT = process.env.PORT || 3000
	http.listen(PORT, () =>
		console.log('>> [Servidor] Aberto na porta ' + PORT))
})()